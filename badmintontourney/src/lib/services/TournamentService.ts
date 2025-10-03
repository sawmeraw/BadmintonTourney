"use server";

import { createClient } from "@/supabase/server";
import { CreateTournamentPayload, UpdateTournamentPayload } from "../types/writes";

export const getTournamentForEdit = async (tournamentId: string) => {
    const supabase = createClient();
    const {data, error} = await (await supabase).from(
        'tournaments'
    ).select('*, locations(*), events(id, name)')
    .eq('id', tournamentId)
    .single();

    if (error) throw new Error(error.message);
    return data;
}

export const getAllLocations = async()=> {
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('locations')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export const updateTournamentWithId = async (tournamentId: string, payload: UpdateTournamentPayload) =>{
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('tournaments')
        .update(payload)
        .eq('id', tournamentId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export const createTournament = async(payload : CreateTournamentPayload): Promise<string | undefined> =>{
    const supabase = createClient();
    const {data, error} = await (await supabase)
    .from('tournaments')
    .insert(payload)
    .select('id')
    .single();

    if (error) throw new Error(error.message);
    return data?.id;
}

export async function isTournamentRegistrationClosed(id: string){
    const supabase = createClient();

    const {data, error} = await (await supabase)
    .from('tournaments')
    .select('is_registration_closed')
    .eq('id', id)
    .single();

    if (error || !data) throw new Error(error.message);
    return data.is_registration_closed || false;
}