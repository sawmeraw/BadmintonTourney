"use server";

import { createClient } from "@/supabase/server";
import { UpdateTournamentPayload } from "../types/writes";

const supabase = createClient();

export const getTournamentForEdit = async (tournamentId: string) => {
    const {data, error} = await (await supabase).from(
        'tournaments'
    ).select('*, locations(*)')
    .eq('id', tournamentId)
    .single();

    if (error) throw new Error(error.message);
    return data;
}

export const getAllLocations = async()=> {
    const {data, error} = await (await supabase)
        .from('locations')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export const updateTournament = async (tournamentId: string, payload: UpdateTournamentPayload) =>{
    const {data, error} = await (await supabase)
        .from('tournaments')
        .update(payload)
        .eq('id', tournamentId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}