import { PageWrapper } from "@/components/layout/PageWrapper";
import { getAllPlayers, getEventTypeDetailsWithEventId, getPaginatedParticipantsWithEventId } from "@/lib/services/EventService";
import {ParticipantManager} from "./_components/ParticipantManager";

const PAGE_SIZE = 10;

export default async function ParticipantRegistrationPage({
    params
} : {
    params: Promise<{tId: string, eId: string }>
}){
    const {tId, eId} = await params;
    const [eventType, allPlayers] = await Promise.all([getEventTypeDetailsWithEventId(eId), getAllPlayers()]);
    return(
        <PageWrapper>
            <ParticipantManager eventId={eId} eventType={eventType} allPlayers={allPlayers}></ParticipantManager>
        </PageWrapper>
    )
}