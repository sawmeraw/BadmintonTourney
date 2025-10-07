import { Participant } from "@/supabase/queryTypes";
import { createClient } from "@/supabase/server";
import { CreateParticipantPayload, CreatePlayerPayload } from "../types/writes";
import {
    canAddParticipantInEvent,
    increaseCurrentEntries,
} from "./EventService";
import { isTournamentRegistrationClosed } from "./TournamentService";

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
    try {
        const [allowedInEvent, allowedInTournament] = await Promise.all([
            canAddParticipantInEvent(eventId),
            isTournamentRegistrationClosed({ eventId: eventId }),
        ]);
        if (!allowedInEvent) {
            throw new Error(
                "Event has either been finalised or is already complete"
            );
        }

        if (!allowedInTournament) {
            throw new Error("Tournament has closed registration");
        }
    } catch (error) {
        throw error;
    }

    const supabase = createClient();
    const { player1, player2, event_type, autoSeed } = payload;
    let newSeed: number | null = null;

    if (event_type === "doubles" && !player2) {
        throw new Error("Player 2 is needed for doubles");
    }

    let player1Id: string;
    let player2Id: string | null = null;

    if (player1.mode === "existing") {
        player1Id = player1.player_id;
    } else {
        player1Id = await createPlayer({
            first_name: player1.first_name,
            last_name: player1.last_name,
            middle_name: player1.middle_name ?? null,
        });
    }

    if (player2) {
        if (player2.mode === "existing") {
            player2Id = player2.player_id;
        } else {
            player2Id = await createPlayer({
                first_name: player2.first_name,
                last_name: player2.last_name,
                middle_name: player2.middle_name ?? null,
            });
        }
    }

    if (autoSeed) {
        newSeed = await getNewSeedForEventId(eventId);
    }

    const { error } = await (await supabase).from("event_participants").insert({
        event_id: eventId,
        player1_id: player1Id,
        player2_id: player2Id,
        status: "active",
        seed: newSeed,
    });

    if (error) throw error;

    await increaseCurrentEntries(eventId);
}

export async function updateStatus() {}
