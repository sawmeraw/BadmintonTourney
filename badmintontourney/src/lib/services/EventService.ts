import { createClient } from "@/supabase/server";
import { CreateEventPayload, CreateParticipantApiPayload, CreatePlayerPayload, UpdateEventPayload } from "../types/writes";
import { EventType, Participant } from "@/supabase/queryTypes";
import { ParticipantListApiResponse } from "../types/api";

export async function getEventWithEventIdForEdit(eventId : string){
    const supabase = createClient();

    const {data, error} = await (await supabase)
        .from('events')
        .select('*, tournaments(name)')
        .eq('id', eventId)
        .single();
    
    if (error) throw new Error(error.details);
    return data;
}

export async function getAllTemplates(){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('tournament_format_templates')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export async function getAllEventTypes(){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('event_types')
        .select('id, name');
    if(error) throw new Error(error.message);
    return data;
}

export async function updateEventWithId(eventId: string, payload: UpdateEventPayload){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('events')
        .update(payload)
        .eq('id', eventId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function createEvent(payload: CreateEventPayload){
    const supabase = createClient();
    const {data, error} = await (await supabase)
        .from('events')
        .insert(payload)
        .select('id')
        .single();
    
    if (error) throw new Error(error.message);
    return data.id;
}

export async function getEventTypeDetailsWithEventId(eventId:string) : Promise<EventType>{
    const supabase = createClient();
    const {data : event, error: eventError} = await (await supabase)
        .from('events')
        .select('event_type_id')
        .eq('id', eventId)
        .single();
    
    if(!event?.event_type_id || eventError) throw new Error("Event not found or missing event type.");

    const {data: eventType, error: typeError} = await (await supabase)
        .from('event_types')
        .select('*')
        .eq('id', event.event_type_id)
        .single();
    
    if(!eventType || typeError) throw new Error("Event type not found");

    return eventType;
}

export async function getPaginatedParticipantsWithEventId(eventId: string, page: number, pageSize: number){
    const supabase = createClient();
    const { data, error } = await (await supabase).rpc('get_event_participants_with_players', {
        p_event_id: eventId,
        p_page_number: page,
        p_page_size: pageSize
    });

    if (error) throw new Error(error.message);
    return {
        participants: (data as ParticipantListApiResponse).participants || [],
        totalCount: (data as ParticipantListApiResponse).totalCount || 0,
    };
}

export async function createPlayer(player: CreatePlayerPayload){
    const supabase = createClient();

    const {data, error} = await (await supabase)
        .from('players')
        .insert(player)
        .select('id')
        .single();
    
    if(!data || error) throw new Error("Error creating player");
    return data.id;
}

async function getNewSeedForEventId(eventId: string){
    const supabase = createClient();
    const {data, error} =   await (await supabase)
        .from('event_participants')
        .select('seed')
        .eq('event_id', eventId);
    
    if (error || !data) throw new Error("Failed to fetch seeds");
    const seeds = data.map((row)=>(row.seed)).filter((s)=> typeof s === "number");
    const newSeed = seeds.length > 0 ? Math.max(...seeds) + 1 : 1;
    return newSeed;
}

async function checkIfSeedCollides(eventId: string, seed: number){
    const supabase = createClient();
    const {data, error} =   await (await supabase)
        .from('event_participants')
        .select('seed')
        .eq('event_id', eventId);
    
    if (error || !data) throw new Error("Failed to fetch seeds");
    const seeds = data.map((row)=>(row.seed)).filter((s)=> typeof s === "number");
    return seeds.includes(seed);
}

export async function createParticipantsWithEventId(eventId: string, payload: CreateParticipantApiPayload){
    const supabase = createClient();
    let {player1, player2, event_id, seed, autoSeed, status} = payload;

    const resolvePlayer = async (player: typeof player1) =>{
        if(player.mode === "existing") return player.player_id;

        try{
            const id = await createPlayer({first_name: player.first_name, last_name: player.last_name, middle_name: player?.middle_name});
            return id;
        }
        catch(error){
            throw error;
        }
    }

    const player1_id = await resolvePlayer(player1);
    const player2_id = player2 ? await resolvePlayer(player2) : null;

    if(autoSeed || !seed){
        try{
            seed = await getNewSeedForEventId(eventId);
        } catch(error){
            throw error;
        }
    }

    const {error : insertError} = await (await supabase)
        .from('event_participants')
        .insert({
            event_id: eventId,
            player1_id: player1_id,
            player2_id: player2_id,
            status: status,
            seed: seed,
        })
    
    if (insertError) throw new Error("Failed to create participant.");
}

