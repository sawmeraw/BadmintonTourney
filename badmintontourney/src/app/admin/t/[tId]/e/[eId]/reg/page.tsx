import { PageWrapper } from "@/components/layout/PageWrapper";
import { getEventTypeDetailsWithEventId, getPaginatedParticipantsWithEventId } from "@/lib/services/EventService";
import ParticipantManager from "./_components/ParticipantManager";

const PAGE_SIZE = 10;

export default async function ParticipantRegistrationPage({
    params
} : {
    params: Promise<{tId: string, eId: string }>
}){
    const {tId, eId} = await params;

    const [participants, eventType] = await Promise.all([getPaginatedParticipantsWithEventId(eId, 1, PAGE_SIZE), getEventTypeDetailsWithEventId(eId)]);

    return(
        <PageWrapper>
            <p>This is the participants page.</p>
            <ParticipantManager eventId={eId} eventType={eventType} initialData={participants} allPlayers={[]}></ParticipantManager>
        </PageWrapper>
    )
}