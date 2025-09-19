'use client';
// TODO: Replace dummy data with a TanStack Query hook to call /api/rounds/[roundId]/brackets

type Round = { id: string; name: string; sequence: number };

export function BracketsTab({ round }: { round: Round }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Brackets for {round.name}</h2>
            <div className="bg-gray-50 h-64 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Interactive brackets will be displayed here.</p>
            </div>
        </div>
    );
}