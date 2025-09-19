'use client';
// TODO: Replace dummy data with a TanStack Query hook to call /api/events/[eventId]/participants

export function ParticipantsTab({ eventId }: { eventId: string }) {
    const dummyParticipants = [
        { id: '1', name: 'Player One', seed: 1 },
        { id: '2', name: 'Player Two', seed: 2 },
        { id: '3', name: 'Player Three', seed: 3 },
        { id: '4', name: 'Player Four', seed: 4 },
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Registered Participants ({dummyParticipants.length})</h2>
            <ul className="divide-y divide-gray-200">
                {dummyParticipants.map(p => (
                    <li key={p.id} className="py-3 flex justify-between items-center">
                        <span className="font-medium text-gray-800">{p.name}</span>
                        <span className="text-sm text-gray-500">Seed #{p.seed}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}