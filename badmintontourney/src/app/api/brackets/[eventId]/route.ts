import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const { eventId } = await params;

        if (!eventId) {
            return NextResponse.json(
                { error: "Event ID is required." },
                { status: 400 }
            );
        }

        const supabase = createClient();
        const { data, error } = await (await supabase)
            .rpc("get_event_brackets", { p_event_id: eventId })
            .single();

        if (error) {
            console.error("Supabase RPC Error:", error.message);
            return NextResponse.json(
                { error: "Failed to fetch bracket details for the event." },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: `Event with ID ${eventId} not found.` },
                { status: 404 }
            );
        }

        // console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected server error occurred.";
        console.error("Unexpected API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
