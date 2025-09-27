import { PageWrapper } from "@/components/layout/PageWrapper";
import EventEditForm from "../_components/EventEditForm";
import { getAllTemplates, getAllEventTypes } from "@/lib/services/EventService";


export default async function CreateEventPage({
  params,
}: {
  params: Promise<{ tId: string }>
}) {
    const {tId} = await params;
    const [templates, eventTypes] = await Promise.all([
        getAllTemplates(), getAllEventTypes()
    ]);

    return (
        <PageWrapper>
            <div className="my-4">
                <h1 className="text-3xl font-bold">Create Event</h1>
            </div>
            <EventEditForm templates={templates} eventTypes={eventTypes} tournamentId={tId} />
        </PageWrapper>
    );
}