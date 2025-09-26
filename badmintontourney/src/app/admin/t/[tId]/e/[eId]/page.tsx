import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { getAllEventTypes, getAllTemplates, getEventWithEventIdForEdit } from "@/lib/services/EventService";
import EventEditForm from "../_components/EventEditForm";

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{tId: string, eId: string }>
}) {
    const {tId, eId} = await params;
    console.log(`route variables here: tId=${tId}, eId=${eId}`);
    const [event, event_types, templates] = await Promise.all([
        getEventWithEventIdForEdit(eId),
        getAllEventTypes(),
        getAllTemplates()
    ]);

    if (!event) notFound();

    return (
        <PageWrapper>
            <div className="my-4">
                <h3 className="text-3xl font-bold"> {event.name} - {event.tournaments.name}</h3>
            </div>
            <EventEditForm initialData={event} eventTypes={event_types} templates={templates} tournamentId={tId}/>
        </PageWrapper>
    );
}