'use client';

import { useParticipants } from "@/hooks/useParticipants";

export function ParticipantsTab({ eventId }: { eventId: string }) {
    const {data, isLoading, isError, error} = useParticipants(eventId);

    if(isLoading) return <div> Loading...</div>
    if(!data || error) return <div>Couldn't load participants.</div>

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Total: {data.totalCount}</h2>
            <ul className="divide-y divide-gray-200">
                {data?.participants?.map((p) => (
                    <li key={p.id} className="py-3 flex justify-between items-center">
                        <span className="font-medium text-gray-800">{p.player1.first_name}</span>
                        <span className="text-sm text-gray-500">Seed #{p.seed}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}