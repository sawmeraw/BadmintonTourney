"use server";

import {
    CreateParticipantPayload,
    createParticipantSchema,
    UpdateParticipantPayload,
    updateParticipantsSchema,
    UpdateSeedPayload,
    updateSeedSchema,
} from "../types/writes";
import {
    createParticipant,
    deleteParticipants,
    removeSeed,
    swapSeed,
    updateParticipantSeed,
    updateParticipantStatus,
    type ParticipantStatus,
} from "../services/ParticipantService";
import { revalidatePath } from "next/cache";

export async function updateParticipantHandler(
    payload: UpdateParticipantPayload
) {
    // console.log(payload);
    let toDeleteIds: string[] = [];
    let toRemoveSeedIds: string[] = [];
    let statusUpdates: Record<ParticipantStatus, string[]> = {
        active: [],
        disqualified: [],
        withdrawn: [],
    };

    for (const update of payload.updates) {
        if (update.isDeleted) {
            toDeleteIds.push(update.id);
        }
        if (update.removeSeed) {
            toRemoveSeedIds.push(update.id);
        }
        if (update.status) {
            statusUpdates[update.status].push(update.id);
        }
    }

    if (toDeleteIds.length > 0) {
        try {
            await deleteParticipants(payload.event_id, toDeleteIds);
        } catch (error) {
            throw error;
        }
    }
    if (toRemoveSeedIds.length > 0) {
        try {
            await removeSeed(toRemoveSeedIds);
        } catch (error) {
            throw error;
        }
    }

    for (const key of Object.keys(statusUpdates) as ParticipantStatus[]) {
        const ids = statusUpdates[key];
        if (ids.length > 0) {
            try {
                await updateParticipantStatus(ids, key);
            } catch (error) {
                throw error;
            }
        }
    }
}

export async function setSeedHandler(payload: UpdateSeedPayload) {
    const validatedFields = updateSeedSchema.safeParse(payload);
    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided." };
    }

    try {
        await updateParticipantSeed(
            validatedFields.data.event_id,
            validatedFields.data.participant_id,
            validatedFields.data.seed
        );
        revalidatePath(`/admin/t/`);
    } catch (error) {
        // console.log(`Error has been caught in the handler ${error}`);
        throw error;
    }
}

export async function createParticipantHandler(
    payload: CreateParticipantPayload
) {
    const validatedFields = createParticipantSchema.safeParse(payload);
    if (!validatedFields.success) {
        throw new Error("Validation failed");
    }

    // console.log("validated fields: ", validatedFields.data);

    try {
        await createParticipant(payload.event_id, payload);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function swapSeedHandler(payload: UpdateParticipantPayload) {
    const validatedFields = updateParticipantsSchema.safeParse(payload);
    if (!validatedFields.success) {
        throw new Error("Validation failed");
    }

    const data = validatedFields.data;
    if (!data.swapSeed) {
        throw new Error("Swap not allowed");
    }

    if (data.updates.length !== 2) {
        throw new Error("Seed can only be swapped between 2 participants");
    }

    try {
        const eventId = data.event_id;
        const participant1Id = data.updates[0].id;
        const participant2Id = data.updates[1].id;

        if (!participant1Id || !participant2Id) {
            throw new Error("participant not selected");
        }

        await swapSeed(eventId, participant1Id, participant2Id);
    } catch (error) {
        throw error;
    }
}
