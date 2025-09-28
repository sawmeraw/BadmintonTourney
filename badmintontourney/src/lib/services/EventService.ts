import { createClient } from "@/supabase/server";
import { CreateEventPayload, UpdateEventPayload } from "../types/writes";
import { EventType, Participant } from "@/supabase/queryTypes";

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

export async function getParticipantsWithEventId(eventId: string){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('events')
        .select('name, event_participants(*)')
        .eq('id', eventId)
        .single();
    
    if(!data || error) throw new Error("Error fetching participants for the event.");

    return data;
}

