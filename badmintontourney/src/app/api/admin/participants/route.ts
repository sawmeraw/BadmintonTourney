import { updateParticipantHandler } from "@/lib/services/ParticipantService";
import { updateParticipantsSchema } from "@/lib/types/writes";
import { NextResponse } from "next/server";

export default async function PUT(request: Request){
    
    const body = await request.json();
    const validatedFields = updateParticipantsSchema.safeParse(body);

    if(!validatedFields.success){
        return NextResponse.json({error: validatedFields.error.message}, {status: 400});
    }

    const validated = validatedFields.data;
    
    try {
        await updateParticipantHandler(validated);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}