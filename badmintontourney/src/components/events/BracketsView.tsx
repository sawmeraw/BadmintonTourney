import type { EventRoundDetailsApiResponse, MatchResponseParticipantProperty, MatchSummary } from '@/lib/types/api';
import { MatchSet } from '@/supabase/queryTypes';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

export type MatchCardPropType = MatchSummary & {
    participant1 : MatchResponseParticipantProperty;
    participant2 : MatchResponseParticipantProperty | null;
    sets :Array<
      Pick<MatchSet, "set_number" | "participant1_score" | "participant2_score">
    >;
}

const MatchCard = ({ match }: { match: MatchCardPropType }) => {
    const p1IsWinner = match.winner_id === match.participant1.id;
    const p2IsWinner = match.winner_id === match.participant2?.id;

    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-4">
                {match.round_match_number && (
                    <p className="text-xs text-gray-500 mb-2">Match #{match.round_match_number}</p>
                )}
                <div className="space-y-2">
                    <div className={`flex items-center justify-between ${p1IsWinner ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        <span>{match.participant1?.player1?.first_name} {match.participant1?.player1?.last_name ?? ''}</span>
                        {p1IsWinner && <CheckCircleIcon className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className={`flex items-center justify-between ${p2IsWinner ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        <span>{match.participant2?.player1?.first_name} {match.participant2?.player1?.last_name ?? ''}</span>
                        {p2IsWinner && <CheckCircleIcon className="h-5 w-5 text-emerald-500" />}
                    </div>
                </div>
            </div>
            {match.status === 'completed' && (
                <div className="border-t bg-gray-50 px-4 py-2 text-right font-mono text-sm text-gray-700">
                    {match.sets.map(set => `${set.participant1_score}-${set.participant2_score}`).join(' / ')}
                </div>
            )}
        </div>
    )
}

export const BracketView = ({ data }: { data: EventRoundDetailsApiResponse }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">{data.name} Bracket</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.matches
                    .sort((a, b) => (a.round_match_number || 0) - (b.round_match_number || 0))
                    .map(match => (
                        <MatchCard key={match.id} match={match} />
                    ))
                }
            </div>
        </div>
    );
};