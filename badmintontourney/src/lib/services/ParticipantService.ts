"use server";

import { Participant } from "@/supabase/queryTypes";
import { createClient } from "@/supabase/server";
import { UpdateParticipantPayload } from "../types/writes";

type ParticipantStatus = Participant["status"];

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
        .update({is_deleted: true})
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

export async function updateParticipantHandler(payload: UpdateParticipantPayload){

    let toDeleteIds: string[] = [];
    let toRemoveSeedIds: string[] = [];
    let statusUpdates: Record<ParticipantStatus, string[]> = {
        "active" : [],
        "disqualified": [],
        "withdrawn": []
    };
    
    for (const update of payload.updates){
        if(update.isDeleted){
            toDeleteIds.push(update.id);
        }
        if(update.removeSeed){
            toRemoveSeedIds.push(update.id);
        }
        if(update.status){
            statusUpdates[update.status].push(update.id);
        }
    }

    if(toDeleteIds.length > 0){
        try{
            await deleteParticipants(toDeleteIds);
        } catch(error){
            throw error;
        }
    }
    if(toRemoveSeedIds.length > 0){
        try{
            await removeSeed(toRemoveSeedIds);
        } catch(error){
            throw error;
        }
    }

    for (const key of Object.keys(statusUpdates) as ParticipantStatus[]) {
        const ids = statusUpdates[key];
        if (ids.length > 0) {
            try{
                await updateParticipantStatus(ids, key);
            } catch(error) {
                throw error;
            }
        }
    }
}