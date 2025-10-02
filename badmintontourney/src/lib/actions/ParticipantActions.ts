"use server";

import { UpdateParticipantPayload, UpdateSeedPayload, updateSeedSchema } from "../types/writes";
import { deleteParticipants, removeSeed, setSeed, updateParticipantSeed, updateParticipantStatus, type ParticipantStatus } from "../services/ParticipantService";
import { revalidatePath } from "next/cache";

export async function updateParticipantHandler(payload: UpdateParticipantPayload){
    // console.log(payload);

    let toDeleteIds: string[] = [];
    let toRemoveSeedIds: string[] = [];
    let statusUpdates: Record<ParticipantStatus, string[]> = {
        "active" : [],
        "disqualified": [],
        "withdrawn": []
    };

    // console.log(`To remove seeds: ${toRemoveSeedIds}`);
    
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

    return {success: true, message: "Participants updated"};
}

export async function setSeedHandler(payload: UpdateSeedPayload){
    const validatedFields = updateSeedSchema.safeParse(payload);
    if(!validatedFields.success){
        return {success: false, message: "Invalid data provided."};
    }

    try{
        await updateParticipantSeed(validatedFields.data.event_id, validatedFields.data.participant_id, validatedFields.data.seed);

        revalidatePath(`/admin/t/`);

        return {success: true, message: "Seed updated successfully."};
    } catch(error){
        const message = error instanceof Error ? error?.message : "Seed needs to be unique for each participant";
        return {success: false, message: message};
    }
}