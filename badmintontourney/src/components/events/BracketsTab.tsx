'use client';
import { useRounds } from '@/hooks/useRounds';
import { PoolsView } from './PoolsView';
import { BracketView } from './BracketsView';

const BracketSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
        <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
            ))}
        </div>
    </div>
);

export function BracketsTab({ round }: { round: { id: string; name: string } }) {

    const { data, isLoading, isError, error } = useRounds(round.id);

    if (isLoading) return <BracketSkeleton />;
    if (isError) return <p className="text-red-500">Error: {error.message}</p>;
    if (!data) return <p className="text-gray-500">No details found for this round.</p>;

    return (
        <div>
            {data.round_type.name === 'Round Robin' && <PoolsView data={data} />}
            {data.round_type.name === 'Single Elimination' && <BracketView data={data} />}
        </div>
    );
}