import type { MatchSummary } from '@/lib/types/api';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { MatchCardPropType } from './BracketsView';

const Score = ({ p1Score, p2Score }: { p1Score: number, p2Score: number }) => (
    <div className="flex font-mono text-sm">
        <span className={p1Score > p2Score ? 'font-bold text-gray-900' : 'text-gray-500'}>
            {String(p1Score).padStart(2, '0')}
        </span>
        <span className="mx-1 text-gray-400">-</span>
        <span className={p2Score > p1Score ? 'font-bold text-gray-900' : 'text-gray-500'}>
            {String(p2Score).padStart(2, '0')}
        </span>
    </div>
);

export const ParticipantMatches = ({ participantId, matches }: { participantId: string, matches: MatchCardPropType[] }) => {
    const participantMatches = matches.filter(
        m => m.participant1?.id === participantId || m.participant2?.id === participantId
    );

    if (participantMatches.length === 0) {
        return <div className="p-4 text-sm text-gray-500 bg-gray-50 border-t">No matches played yet.</div>;
    }

    return (
        <div className="bg-gray-50/70 border-t p-4 space-y-3">
            {participantMatches.map(match => {
                const isP1 = match.participant1?.id === participantId;
                const opponent = isP1 ? match.participant2 : match.participant1;
                const isWinner = match.winner_id === participantId;

                return (
                    <div key={match.id} className="text-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {isWinner && <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />}
                                <span className={isWinner ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                                    vs. {opponent?.player1.first_name} {opponent?.player1.last_name}
                                    {opponent?.player2 && ` / ${opponent.player2.first_name}`}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                {match.sets.map(set => {
                                    const p1Score = isP1 ? set.participant1_score : set.participant2_score;
                                    const p2Score = isP1 ? set.participant2_score : set.participant1_score;
                                    return <Score key={set.set_number} p1Score={p1Score} p2Score={p2Score} />;
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};