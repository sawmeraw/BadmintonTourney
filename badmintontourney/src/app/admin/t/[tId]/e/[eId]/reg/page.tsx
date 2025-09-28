import { PageWrapper } from "@/components/layout/PageWrapper";
import { getEventTypeDetailsWithEventId, getParticipantsWithEventId } from "@/lib/services/EventService";

export default async function ParticipantRegistrationPage({
    params
} : {
    params: Promise<{tId: string, eId: string }>
}){
    const {tId, eId} = await params;

    const [participants, eventType] = await Promise.all([getParticipantsWithEventId(eId), getEventTypeDetailsWithEventId(eId)]);

    return(
        <PageWrapper>
            <p>This is the participants page.</p>
        </PageWrapper>
    )
}