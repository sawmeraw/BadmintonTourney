import { createClient } from "@/supabase/server";
import { CreateEventPayload, UpdateEventPayload } from "../types/writes";

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