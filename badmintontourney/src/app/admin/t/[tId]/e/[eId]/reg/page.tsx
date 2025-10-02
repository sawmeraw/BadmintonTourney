import { PageWrapper } from "@/components/layout/PageWrapper";
import { getAllPlayers, getEventTypeDetailsWithEventId, getPaginatedParticipantsWithEventId } from "@/lib/services/EventService";
import {ParticipantManagerUI} from "./_components/ParticipantManager";
import { ParticipantProvider } from "./_context/ParticipantManagerContext";
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
            <ParticipantProvider eventId={eId}>
                <ParticipantManagerUI eventType={eventType} allPlayers={allPlayers}></ParticipantManagerUI>
            </ParticipantProvider>
        </PageWrapper>
    )
}