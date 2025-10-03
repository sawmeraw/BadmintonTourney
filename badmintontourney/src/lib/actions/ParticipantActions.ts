"use server";

import { UpdateParticipantPayload, UpdateSeedPayload, updateSeedSchema } from "../types/writes";
import { deleteParticipants, removeSeed, setSeed, updateParticipantSeed, updateParticipantStatus, type ParticipantStatus } from "../services/ParticipantService";
import { revalidatePath } from "next/cache";

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
            await deleteParticipants(payload.event_id, toDeleteIds);
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

export async function setSeedHandler(payload: UpdateSeedPayload){
    const validatedFields = updateSeedSchema.safeParse(payload);
    if(!validatedFields.success){
        return {success: false, message: "Invalid data provided."};
    }

    try{
        await updateParticipantSeed(validatedFields.data.event_id, validatedFields.data.participant_id, validatedFields.data.seed);
        revalidatePath(`/admin/t/`);

    } catch(error){
        console.log(`Error has been caught in the handler ${error}`);
        throw error;
    }
}