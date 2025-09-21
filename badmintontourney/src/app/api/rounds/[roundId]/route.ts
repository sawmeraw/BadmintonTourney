import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    {params}: {params: {roundId: string}}
){
    try {
        const { roundId } = await params;

        if (!roundId) {
            return NextResponse.json({ error: "Round ID is required." }, { status: 400 });
        }

        const supabase = createClient();
        const { data, error } = await (await supabase)
            .rpc('get_round_details', { p_round_id: roundId })
            .single();

        if (error) {
            console.error("Supabase RPC Error:", error.message);
            return NextResponse.json({ error: "Failed to fetch round details from the database." }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: `Round with ID ${roundId} not found.` }, { status: 404 });
        }
        return NextResponse.json(data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
        console.error("Unexpected API Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
    
}