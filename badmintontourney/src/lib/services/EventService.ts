"use server";

import { createClient } from "@/supabase/server";
import { CreateEventPayload, UpdateEventPayload } from "../types/writes";
import { EventType } from "@/supabase/queryTypes";
import { ParticipantListApiResponse, PlayerBase } from "../types/api";

export async function getEventWithEventIdForEdit(eventId : string){
    const supabase = createClient();

    const {data, error} = await (await supabase)
        .from('events')
        .select('*, tournaments(name)')
        .eq('id', eventId)
        .single();
    
    if (error) throw new Error(error.details);
    return data;
}

export async function getAllTemplates(){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('tournament_format_templates')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export async function getAllEventTypes(){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('event_types')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export async function updateEventWithId(eventId: string, payload: UpdateEventPayload){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('events')
        .update(payload)
        .eq('id', eventId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function createEvent(payload: CreateEventPayload){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('events')
        .insert(payload)
        .select('id')
        .single();
    
    if (error) throw new Error(error.message);
    return data.id;
}

export async function getEventTypeDetailsWithEventId(eventId:string) : Promise<EventType>{
    const supabase = createClient();
    const {data : event, error: eventError} = await (await supabase)
        .from('events')
        .select('event_type_id')
        .eq('id', eventId)
        .single();
    
    if(!event?.event_type_id || eventError) throw new Error("Event not found or missing event type.");

    const {data: eventType, error: typeError} = await (await supabase)
        .from('event_types')
        .select('*')
        .eq('id', event.event_type_id)
        .single();
    
    if(!eventType || typeError) throw new Error("Event type not found");

    return eventType;
}

export async function getPaginatedParticipantsWithEventId(eventId: string, page: number, pageSize: number){
    const supabase = createClient();
    const { data, error } = await (await supabase).rpc('get_event_participants_with_players', {
        p_event_id: eventId,
        p_page_number: page,
        p_page_size: pageSize
    });

    if (error) throw new Error(error.message);
    return {
        participants: (data as ParticipantListApiResponse).participants || [],
        totalCount: (data as ParticipantListApiResponse).totalCount || 0,
    };
}


export async function getAllPlayers() : Promise<PlayerBase[]>{
    const supabase = createClient();

    const {data, error} = await (await supabase)
        .from('players')
        .select('id, first_name, last_name');
    
    if (error || !data) throw new Error("Error fetching players");
    return data;
}

export async function getParticipantManagerConfigForEventId(eventId: string){
    const supabase = createClient();

    const {data, error} = await (await supabase)
        .from('events')
        .select('max_participants, current_entries, finalised_for_matches')
        .eq('id', eventId)
        .single();
    
    if (error || !data) throw new Error("Error fetching participant manager config");

    return data;
}


export async function increaseCurrentEntries(eventId: string){
    const supabase = createClient();

    const {error} = await (await supabase)
        .rpc("increment_current_entries", {
            event_id_input: eventId
        });
    
    if(error) throw error;
}