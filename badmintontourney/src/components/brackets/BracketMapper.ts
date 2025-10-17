import {
    type EventBracketsApiResponse,
    type MatchResponseParticipantProperty,
} from "@/lib/types/api";
import {
    type BracketContestant,
    type BracketMatch,
    type BracketryData,
    type BracketSide,
    type BracketScore,
} from "@/lib/types/bracketry";

function getParticipantName(
    participant: MatchResponseParticipantProperty | null
): string {
    if (!participant?.player1) {
        return "TBD";
    }
    let name = `${participant.player1.first_name} ${
        participant.player1.last_name || ""
    }`;
    if (participant.player2) {
        name += `/${participant.player2.first_name} ${
            participant.player2.last_name || ""
        }`;
    }

    return name;
}

export default function transformDataForBracketry(
    apiData: EventBracketsApiResponse
) {
    const contestants: BracketryData["contestants"] = {};
    const matches: BracketryData["matches"] = [];

    const rounds: BracketryData["rounds"] = apiData.rounds.map((round) => ({
        name: round.name,
    }));

    apiData.rounds.forEach((round, roundIndex) => {
        round.matches.forEach((match) => {
            const p1 = match.participant1;
            const p2 = match.participant2;

            const side1: BracketSide = {
                contestantId: p1?.id || `tbd_${match.id}_1`,
                isWinner: p1 ? match.winner_id === p1.id : false,
                scores: p1
                    ? match.sets.map((set) => ({
                          mainScore: String(set.participant1_score),
                          isWinner:
                              set.participant1_score > set.participant2_score,
                      }))
                    : [],
            };

            const side2: BracketSide = {
                contestantId: p2?.id || `tbd_${match.id}_2`,
                isWinner: p2 ? match.winner_id === p2.id : false,
                scores: p2
                    ? match.sets.map((set) => ({
                          mainScore: String(set.participant2_score),
                          isWinner:
                              set.participant2_score > set.participant1_score,
                      }))
                    : [],
            };

            const newMatch: BracketMatch = {
                roundIndex: roundIndex,
                order: (match.round_match_number || 1) - 1,
                matchStatus:
                    match.status.charAt(0).toUpperCase() +
                    match.status.slice(1),
                sides: [side1, side2],
            };
            matches.push(newMatch);

            [p1, p2].forEach((p) => {
                if (p && !contestants[p.id]) {
                    const contestant: BracketContestant = {
                        players: [{ title: getParticipantName(p) }],
                    };
                    contestants[p.id] = contestant;
                }
            });
        });
    });

    return { rounds, matches, contestants };
}
