import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { fixToArray } from "@/supabase/queryTypes";


const getEventById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('tournaments')
    .select('id, name, start_date, end_date, status, shuttle_info, description, food_info, misc_info, banner_url, parking_info, views, is_registration_closed, contact_info, locations(name, address_line1, address_line2, city, postcode, state), events(id, name, entry_fee, first_prize_money, max_participants, current_entries)')
    .eq('id', id)
    .single();
  if (error || !data) notFound();
  return data;
};

// export default async function EventDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const {id} = await params;
//   const tournament = await getEventById(id);
//   const normalizedTournament = {
//     ...tournament,
//     locations: fixToArray(tournament.locations)
//   }
//   return <TournamentTabs tournament={normalizedTournament}/>

// }