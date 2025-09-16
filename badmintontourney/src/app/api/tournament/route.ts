import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";
import {z} from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const createTournamentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_date: z.string().refine(val => isoDateRegex.test(val), {
    message: 'Invalid start date format. Use ISO 8601 format like 2025-10-01T00:00:00Z',
  }),
  end_date: z.string().refine(val => isoDateRegex.test(val), {
    message: 'Invalid end date format. Use ISO 8601 format like 2025-10-05T00:00:00Z',
  }),
  location_id: z.uuid('A valid location ID is required'),
});

export async function POST(req: Request){
    const supabase = createClient();

    try{
        const body = await req.json();
        const validation = createTournamentSchema.safeParse(body);

        if(!validation.success){
            return NextResponse.json({error: z.treeifyError(validation.error)}, {status: 400});
        }

        const {data, error} = await (await supabase).from("tournaments").insert({
            name: validation.data.name,
            start_date: validation.data.start_date,
            end_date: validation.data.end_date,
            location_id: validation.data.location_id,
            status: "upcoming",
        })
        .select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 6. Return the newly created tournament data with a 201 status code.
        return NextResponse.json(data, { status: 201 });

    } catch (e) {
    // Handle cases where the request body isn't valid JSON.
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
