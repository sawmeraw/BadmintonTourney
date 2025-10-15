import { EventHeader } from "@/components/events/EventHeader";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";

const getEventById = async (eventId: string) => {
    const supabase = createClient();
    const { data, error } = await (await supabase)
        .from("events")
        .select(
            `id, name, description, tournaments(name), event_rounds(id, name, sequence)`
        )
        .eq("id", eventId)
        .single();

    if (error || !data) {
        console.error("Error fetching event details: ", error);
        notFound();
    }
    // console.dir(data, {depth: null});
    return data;
};

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const event = await getEventById(slug);

    return (
        <PageWrapper>
            <EventHeader event={event} />
        </PageWrapper>
    );
}
