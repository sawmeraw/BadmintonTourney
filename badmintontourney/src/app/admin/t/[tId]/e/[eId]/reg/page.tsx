import { PageWrapper } from "@/components/layout/PageWrapper";
import {
    getAllPlayers,
    getEventTypeDetailsWithEventId,
    getParticipantManagerConfigForEventId,
} from "@/lib/services/EventService";
import { ParticipantManagerUI } from "./_components/ParticipantManager";
import { ParticipantProvider } from "./_context/ParticipantManagerContext";
import { isTournamentRegistrationClosed } from "@/lib/services/TournamentService";

export default async function ParticipantRegistrationPage({
    params,
}: {
    params: Promise<{ tId: string; eId: string }>;
}) {
    const { tId, eId } = await params;
    const [eventType, allPlayers, config, tournamentRegistrationClosed] =
        await Promise.all([
            getEventTypeDetailsWithEventId(eId),
            getAllPlayers(),
            getParticipantManagerConfigForEventId(eId),
            isTournamentRegistrationClosed({ tournamentId: tId }),
        ]);
    const eventConfig = {
        ...config,
        ...eventType,
        tournamentRegistrationClosed,
    };

    // console.log(eventConfig);

    return (
        <PageWrapper>
            <ParticipantProvider eventId={eId}>
                <ParticipantManagerUI
                    eventConfig={eventConfig}
                    allPlayers={allPlayers}
                ></ParticipantManagerUI>
            </ParticipantProvider>
        </PageWrapper>
    );
}
