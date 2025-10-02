
import { Participant } from "@/supabase/queryTypes";
import { createClient } from "@/supabase/server";

export type ParticipantStatus = Participant["status"];

export async function removeSeed(ids: string[]){
    const supabase = createClient();

    const {error} = await (await supabase)
        .from('event_participants')
        .update({seed: null})
        .in('id', ids);
    
    if(error) throw new Error(error.message);
}

export async function deleteParticipants(ids: string[]){
    const supabase = createClient();
    const {error} = await (await supabase)
        .from('event_participants')
        .update({is_deleted: true, seed: null})
        .in('id', ids);
    
    if(error) throw new Error(error.message);
}

export async function updateParticipantStatus(ids: string[], status: ParticipantStatus){
    const supabase = createClient();
    const {error} = await (await supabase)
        .from('event_participants')
        .update({status: status})
        .in('id', ids);
    
    if(error) throw new Error(error.message);
}

export async function setSeed(id: string, newSeed: number){
    const supabase = createClient();
    
    const {error} = await (await supabase)
        .from('event_participants')
        .update({seed: newSeed})
        .eq('id', id);
    
    console.log(error);
    if (error) throw error;
    
}

export async function updateParticipantSeed(eventId: string, participantId: string, newSeed: number | null){
    const supabase = createClient();

    if( newSeed !== null){
        const {data: existingSeed, error: conflictError} = await (await supabase)
            .from('event_participants')
            .select('id')
            .eq('event_id', eventId)
            .eq('seed', newSeed)
            .not('id', 'eq', participantId)
            .maybeSingle();
        
        if(conflictError) throw new Error(conflictError.message);

        if(existingSeed){
            throw new Error(`Seed #${newSeed} is already taken in this event`);
        }
    }

    const {data: updatedData, error: updateError} = await (await supabase)
        .from('event_participants')
        .update({seed: newSeed})
        .eq('id', participantId)
        .select()
        .single();

    if (updateError) throw new Error(updateError.message);

    return updatedData;
}
