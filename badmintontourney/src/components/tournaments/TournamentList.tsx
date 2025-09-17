import { Database } from '@/supabase/types';
import { TournamentCard } from './TournamentCard';
import { TournamentListItem } from '@/supabase/queryTypes';

export const TournamentList = ({ tournaments }: { tournaments: TournamentListItem[] }) => {
    if (tournaments.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold">No Tournaments Found</h3>
                <p className="text-gray-500 mt-2">Check back later or try a different filter.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </div>
    );
};