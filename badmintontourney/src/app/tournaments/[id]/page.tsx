// File: app/tournaments/[id]/page.tsx

import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import { 
  CalendarDaysIcon, 
  MapPinIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { LinkButton } from "@/components/utils/LinkButton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { RegistrationStatus } from "@/components/utils/RegistrationStatus";
import { TournamentDetailClient } from "@/components/tournaments/TournamentTabs";
import { fixToArray } from "@/supabase/queryTypes";


const getTournamentById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await (await supabase)
    .from('tournaments')
    .select('id, name, start_date, end_date, status, shuttle_info, description, food_info, misc_info, banner_url, parking_info, views, is_registration_closed, contact_info, locations(name, address_line1, address_line2, city, postcode, state), events(id, name)')
    .eq('id', id)
    .single();
  if (error || !data) notFound();
  console.dir(data, {depth: null});
  return data;
};

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params;
  const tournament = await getTournamentById(id);
  const normalizedTournament = {
    ...tournament,
    locations: fixToArray(tournament.locations)
  }
  return <TournamentDetailClient tournament={normalizedTournament}/>

}