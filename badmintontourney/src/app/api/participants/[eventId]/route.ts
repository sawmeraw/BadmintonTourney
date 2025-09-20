import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

const PAGE_SIZE = 20;

export async function GET(
    request: Request,
    {params}: {params: {eventId: string}}
){
    try{
        const {eventId} = await params;
        const supabase = createClient();
        console.log("event id passed: ", eventId);
        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || String(PAGE_SIZE), 10);

        const {data, error} = await (await supabase).rpc('get_event_participants_with_players', 
            {
                p_event_id: eventId,
                p_page_number: page,
                p_page_size: pageSize
            }
        );

        // console.dir(data, {depth: null});

        if(error){
            console.error(error);
            return NextResponse.json({error: error.message}, {status: 500});
        }

        return NextResponse.json(data);
    } catch(error){
        console.error(error);
        return NextResponse.json({error: error}, {status: 500});
    }
}