import { Database } from "./types";

export type TournamentListItem = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  locations: {
    city: string;
    name: string;
  }[] | null;
  events: {count: number}[];
};

export type TournamentSummary = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  shuttle_info: string;
  banner_url: string;
  is_registration_closed: boolean;
  parking_info: string;
  food_info: string;
  misc_info: string;
  contact_info: string;
  locations: {
    name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postcode: string;
    state: string;
  }[];
  events: {
    id: string;
    name: string;
   }[];
};

export type Location = Database['public']['Tables']['locations']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];

export function fixToArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}
