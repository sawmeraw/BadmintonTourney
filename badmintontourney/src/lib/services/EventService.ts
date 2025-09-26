import { createClient } from "@/supabase/server";

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