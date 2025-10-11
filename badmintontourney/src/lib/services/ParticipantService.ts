import { Participant } from "@/supabase/queryTypes";
import { createClient } from "@/supabase/server";
import { CreateParticipantPayload, CreatePlayerPayload } from "../types/writes";

export type ParticipantStatus = Participant["status"];

export async function removeSeed(ids: string[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("event_participants")
        .update({ seed: null })
        .in("id", ids);

    if (error) throw new Error(error.message);
}

export async function deleteParticipants(
    eventId: string,
    participantIds: string[]
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_participants")
        .update({ is_deleted: true, seed: null })
        .in("id", participantIds);

    if (error) throw new Error(error.message);
}

export async function updateParticipantStatus(
    ids: string[],
    status: ParticipantStatus
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("event_participants")
        .update({ status: status })
        .in("id", ids);

    if (error) throw new Error(error.message);
}

async function getNewSeedForEventId(eventId: string) {
    const supabase = await createClient();

    //get the max participants set in events table

    const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("max_participants")
        .eq("id", eventId)
        .single();

    if (eventError || !eventData)
        throw new Error("Failed to fetch event details");

    const maxParticipants = eventData.max_participants;
    if (typeof maxParticipants !== "number")
        throw new Error("Invalid max participants value");

    //get all seeds
    const { data: seedData, error: seedError } = await supabase
        .from("event_participants")
        .select("seed")
        .eq("event_id", eventId);

    if (seedError || !seedData) throw new Error("Failed to fetch seeds");

    const usedSeeds = seedData
        .map((row) => row.seed)
        .filter((s) => typeof s === "number");

    //find the first unused seed
    for (let i = 1; i <= maxParticipants; i++) {
        if (!usedSeeds.includes(i)) {
            return i;
        }
    }

    throw new Error("No available seed found");
}

export async function createPlayer(player: CreatePlayerPayload) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("players")
        .insert(player)
        .select("id")
        .single();

    if (!data || error) throw new Error("Error creating player");
    return data.id;
}

export async function setSeed(id: string, newSeed: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("event_participants")
        .update({ seed: newSeed })
        .eq("id", id);

    // console.log(error);
    if (error) throw error;
}

export async function updateParticipantSeed(
    eventId: string,
    participantId: string,
    newSeed: number | null
) {
    const supabase = await createClient();

    const { error } = await supabase.rpc("update_seed", {
        p_event_id: eventId,
        p_participant_id: participantId,
        newseed: newSeed !== null ? newSeed : undefined,
    });

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

export async function createParticipant(
    eventId: string,
    payload: CreateParticipantPayload
) {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("register_participant", {
        p_event_id: eventId,
        p_is_doubles: payload.event_type === "doubles" ? true : false,
        p_player1: payload.player1,
        p_player2: payload.player2 || null,
    });

    if (error) {
        // console.log(error.message);
        throw new Error(error.message);
    }

    if (payload.autoSeed) {
        const newParticipant = data as Participant;
        try {
            const newSeed = await getNewSeedForEventId(eventId);
            await supabase
                .from("event_participants")
                .update({ seed: newSeed })
                .eq("id", newParticipant.id);
        } catch (error) {
            throw new Error("Participant created but couldn't autoseed");
        }
    }
}

async function getCurrentSeed(participant_id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("event_participants")
        .select("seed")
        .eq("id", participant_id)
        .single();

    if (error) {
        throw error;
    }

    if (!data.seed) {
        throw new Error("Seed is not set");
    }

    return data.seed;
}

export async function swapSeed(
    eventId: string,
    participant1_id: string,
    participant2_id: string
) {
    let participant1Seed: number;
    let participant2Seed: number;

    try {
        [participant1Seed, participant2Seed] = await Promise.all([
            getCurrentSeed(participant1_id),
            getCurrentSeed(participant2_id),
        ]);

        if (!participant1Seed || !participant2Seed) {
            throw new Error("Cannot swap seeds that are not set");
        }
    } catch (error) {
        throw new Error("Error occured fetching seeds for the participants");
    }

    try {
        await Promise.all([
            updateParticipantSeed(eventId, participant1_id, null),
            updateParticipantSeed(eventId, participant2_id, null),
        ]);
    } catch (error) {
        throw new Error("Error resetting seeds");
    }

    try {
        await Promise.all([
            updateParticipantSeed(eventId, participant1_id, participant2Seed),
            updateParticipantSeed(eventId, participant2_id, participant1Seed),
        ]);
    } catch (error) {
        console.log(error);
        throw new Error("Error swapping seeds. Seed removed.");
    }
}
