import { Database } from "./types";

export type TournamentListItem = Pick<Tournament, "id" | "name" | "status" | "start_date" | "end_date"> & {
  locations: Pick<Location, "name" | "city"> | null,
  events: {
    count: number
  }[]
};

export type EventQueryResult = {
    id: string;
    name: string | null;
    tournaments: {
        name: string;
    };
    event_rounds: {
        id: string;
        name: string;
        sequence: number;
    }[];
}

export type FetchParticipantsApiResponse = Omit<Participant, "">


export type TournamentSummary = Omit<Tournament, "created_at" | "created_by" | "location_id" | "updated_at"> & {
  locations: Omit<Location, "created_at" | "id" | "updated_at"> | null,
  events: Pick<Event, "id" | "name" | "entry_fee" | "first_prize_money" | "max_participants" | "current_entries">[] 
};

export type Location = Database['public']['Tables']['locations']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventType = Database['public']['Tables']['event_types']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type Participant = Database['public']['Tables']['event_participants']['Row'];
export type Player = Database['public']['Tables']['players']['Row'];
export type EventRound = Database['public']['Tables'] ['event_rounds']['Row'];
export type RoundGroup = Database['public']['Tables'] ['round_groups']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type MatchSet = Database['public']['Tables']['match_sets']['Row'];
export type RoundType = Database['public']['Tables']['round_types']['Row'];

export function fixToArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}
