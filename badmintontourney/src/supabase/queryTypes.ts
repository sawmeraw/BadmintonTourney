import { Database } from "./types";

export type TournamentListItem = Pick<Tournament, "id" | "name" | "status" | "start_date" | "end_date"> & {
  locations: Pick<Location, "name" | "city"> | null,
  events: {
    count: number
  }[]
};

export type TournamentSummary = Omit<Tournament, "created_at" | "created_by" | "location_id" | "updated_at"> & {
  locations: Omit<Location, "created_at" | "id" | "updated_at"> | null,
  events: Pick<Event, "id" | "name" | "entry_fee" | "first_prize_money" | "max_participants" | "current_entries">[] 
};

export type Location = Database['public']['Tables']['locations']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];

export function fixToArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}
