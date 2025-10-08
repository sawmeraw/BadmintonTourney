import { Participant } from "@/supabase/queryTypes";
import { createClient } from "@/supabase/server";
import { CreateParticipantPayload, CreatePlayerPayload } from "../types/writes";
import {
    canAddParticipantInEvent,
    increaseCurrentEntries,
} from "./EventService";
import { isTournamentRegistrationClosed } from "./TournamentService";
import { getPlayerById } from "./PlayerService";

export type ParticipantStatus = Participant["status"];

export async function removeSeed(ids: string[]) {
    const supabase = createClient();

    const { error } = await (await supabase)
        .from("event_participants")
        .update({ seed: null })
        .in("id", ids);

    if (error) throw new Error(error.message);
}

export async function deleteParticipants(
    eventId: string,
    participantIds: string[]
) {
    const supabase = createClient();
    const { data, error } = await (await supabase)
        .from("event_participants")
        .update({ is_deleted: true, seed: null })
        .in("id", participantIds);

    if (error) throw new Error(error.message);

    const { error: decrementError } = await (
        await supabase
    ).rpc("decrement_current_entries", {
        event_id_input: eventId,
        count_input: participantIds.length,
    });

    if (decrementError) {
        console.log(decrementError);
        throw new Error("Couldn't update current entries for the event.");
    }
}

export async function updateParticipantStatus(
    ids: string[],
    status: ParticipantStatus
) {
    const supabase = createClient();
    const { error } = await (await supabase)
        .from("event_participants")
        .update({ status: status })
        .in("id", ids);

    if (error) throw new Error(error.message);
}

async function getNewSeedForEventId(eventId: string) {
    const supabase = createClient();
    const { data, error } = await (await supabase)
        .from("event_participants")
        .select("seed")
        .eq("event_id", eventId);

    if (error || !data) throw new Error("Failed to fetch seeds");
    const seeds = data
        .map((row) => row.seed)
        .filter((s) => typeof s === "number");
    const newSeed = seeds.length > 0 ? Math.max(...seeds) + 1 : 1;
    return newSeed;
}

export async function createPlayer(player: CreatePlayerPayload) {
    const supabase = createClient();

    const { data, error } = await (await supabase)
        .from("players")
        .insert(player)
        .select("id")
        .single();

    if (!data || error) throw new Error("Error creating player");
    return data.id;
}

export async function setSeed(id: string, newSeed: number) {
    const supabase = createClient();

    const { error } = await (await supabase)
        .from("event_participants")
        .update({ seed: newSeed })
        .eq("id", id);

    console.log(error);
    if (error) throw error;
}

export async function updateParticipantSeed(
    eventId: string,
    participantId: string,
    newSeed: number | null
) {
    const supabase = createClient();

    if (newSeed !== null) {
        const { data: existingSeed, error: conflictError } = await (
            await supabase
        )
            .from("event_participants")
            .select("id")
            .eq("event_id", eventId)
            .eq("seed", newSeed)
            .not("id", "eq", participantId)
            .maybeSingle();

        if (conflictError) throw new Error(conflictError.message);

        if (existingSeed) {
            throw new Error(`Seed #${newSeed} is already taken in this event`);
        }
    }

    const { data: updatedData, error: updateError } = await (await supabase)
        .from("event_participants")
        .update({ seed: newSeed })
        .eq("id", participantId)
        .select()
        .single();

    if (updateError) throw new Error(updateError.message);

    return updatedData;
}

export async function createParticipant(
    eventId: string,
    payload: CreateParticipantPayload
) {
    const supabase = createClient();

    const { data, error } = await (
        await supabase
    ).rpc("register_participant", {
        p_event_id: eventId,
        p_is_doubles: payload.event_type === "doubles" ? true : false,
        p_player1: payload.player1,
        p_player2: payload.player2 || null,
    });

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

async function getCurrentSeed(participant_id: string) {
    const supabase = createClient();

    const { data, error } = await (await supabase)
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
        const [res1, res2] = await Promise.all([
            updateParticipantSeed(eventId, participant1_id, null),
            updateParticipantSeed(eventId, participant2_id, null),
        ]);
        if (!res1 || !res2) {
            throw new Error("Failed to reset seed");
        }
    } catch (error) {
        throw new Error("Error resetting seeds");
    }

    try {
        const [res1, res2] = await Promise.all([
            updateParticipantSeed(eventId, participant1_id, participant2Seed),
            updateParticipantSeed(eventId, participant2_id, participant1Seed),
        ]);
        if (!res1 || !res2) {
            throw new Error("Error swapping seeds");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error swapping seeds. Seed removed.");
    }
}
