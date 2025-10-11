"use server";

import { createClient } from "@/supabase/server";
import {
    CreateEventPayload,
    UpdateEventPayload,
    UpdateFinalizedEventPayload,
} from "../types/writes";
import { EventType } from "@/supabase/queryTypes";
import { ParticipantListApiResponse, PlayerBase } from "../types/api";
import { PostgrestError } from "@supabase/supabase-js";
import { _generateStraightKnockoutRounds } from "./RoundService";

export async function getEventWithEventIdForEdit(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select("*, tournaments(name)")
        .eq("id", eventId)
        .single();

    if (error) throw new Error(error.details);
    return data;
}

export async function getAllTemplates() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tournament_format_templates")
        .select("id, name");
    if (error) throw new Error(error.message);
    return data;
}

export async function getAllEventTypes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_types")
        .select("id, name");
    if (error) throw new Error(error.message);
    return data;
}

export async function updateEventWithId(
    eventId: string,
    payload: UpdateEventPayload | UpdateFinalizedEventPayload
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", eventId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function createEvent(payload: CreateEventPayload) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select("id")
        .single();

    if (error) throw new Error(error.message);
    return data.id;
}

export async function getEventTypeDetailsWithEventId(
    eventId: string
): Promise<EventType> {
    const supabase = await createClient();
    const { data: event, error: eventError } = await supabase
        .from("events")
        .select("event_type_id")
        .eq("id", eventId)
        .single();

    if (!event?.event_type_id || eventError)
        throw new Error("Event not found or missing event type.");

    const { data: eventType, error: typeError } = await supabase
        .from("event_types")
        .select("*")
        .eq("id", event.event_type_id)
        .single();

    if (!eventType || typeError) throw new Error("Event type not found");

    return eventType;
}

export async function getPaginatedParticipantsWithEventId(
    eventId: string,
    page: number,
    pageSize: number
) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
        "get_event_participants_with_players",
        {
            p_event_id: eventId,
            p_page_number: page,
            p_page_size: pageSize,
        }
    );

    if (error) throw new Error(error.message);
    return {
        participants: (data as ParticipantListApiResponse).participants || [],
        totalCount: (data as ParticipantListApiResponse).totalCount || 0,
    };
}

export async function getAllPlayers(): Promise<PlayerBase[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("players")
        .select("id, first_name, last_name");

    if (error || !data) throw new Error("Error fetching players");
    return data;
}

export async function getParticipantManagerConfigForEventId(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select("max_participants, current_entries, finalised_for_matches")
        .eq("id", eventId)
        .single();

    if (error || !data)
        throw new Error("Error fetching participant manager config");

    return data;
}

export async function increaseCurrentEntries(eventId: string) {
    const supabase = await createClient();

    const { error } = await supabase.rpc("increment_current_entries", {
        event_id_input: eventId,
    });

    if (error) throw error;
}

export async function canAddParticipantInEvent(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select(
            "is_complete, finalised_for_matches, tournaments(is_registration_closed)"
        )
        .eq("id", eventId)
        .single();

    if (error) {
        throw new Error("Cannot find event in the database");
    }

    if (data.finalised_for_matches || data.is_complete) {
        return false;
    }

    return true;
}

export async function validateFinalizeEvent(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("validate_finalize_event", {
        p_event_id: eventId,
    });

    if (!data) {
        console.log("not sure what this means");
    }

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getFinalizeValidationDetails(
    eventId: string
): Promise<{ success: boolean; details: string }> {
    try {
        const success = await validateFinalizeEvent(eventId);
        if (!success) {
            return {
                success: false,
                details:
                    "Some unknown reason will prevent finalizing the matches",
            };
        }
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                ? error
                : "An unknown error occurred";
        return { success: false, details: `${message}` };
    }

    return { success: true, details: "Event is ready to be finalized" };
}

export async function generateRoundsAndGroups(eventId: string) {
    const supabase = await createClient();

    const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*, tournament_format_templates(name)")
        .eq("id", eventId)
        .single();

    if (eventError || !eventData) throw new Error("Event not found");

    console.log(eventData);
    const { data: participantCount, error: countError } = await supabase.rpc(
        "get_event_participant_count",
        {
            p_event_id: eventId,
        }
    );

    if (!participantCount || countError) {
        // console.log(countError);
        throw new Error("Error finding participants");
    }
    const formatName = eventData.tournament_format_templates?.name;

    switch (formatName) {
        case "Straight Knockout":
            await _generateStraightKnockoutRounds(eventId, participantCount);
            break;
        case "Pools to Knockout":
            break;
        default:
            throw new Error(
                `Unknown or unsupported event format: ${formatName}`
            );
    }
}
