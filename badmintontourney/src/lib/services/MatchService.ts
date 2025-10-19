"use server";

import { createClient } from "@/supabase/server";

export async function getMatchesForRoundId(eventId: string) {
  const supabase = await createClient();
}
