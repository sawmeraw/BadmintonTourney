import { createClient } from "@/supabase/server";

export async function getPlayerById(id: string) {
    const supabase = createClient();

    const { data, error } = await (await supabase)
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) throw new Error("Error fetching player");
    return data;
}
