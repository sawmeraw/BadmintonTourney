'use client';

import { StatusBadge } from '@/components/utils/StatusBadge';
import { Participant } from '@/supabase/queryTypes';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ParticipantRowProps{
    participant: Participant;
}

export const ParticipantRow = ( {participant}: ParticipantRowProps) => {
    // NOTE: Your data fetching needs to be updated to JOIN the player names.
    // For now, we'll display the player IDs as placeholders.
    const player1Name = `Player (${participant.player1_id.substring(0, 8)}...)`;
    const player2Name = participant.player2_id ? ` & Player (${participant.player2_id.substring(0, 8)}...)` : '';

    return (
        <tr>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {player1Name}{player2Name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <button className="flex items-center group">
                    <span>{participant.seed || 'Unseeded'}</span>
                    <PencilIcon className="h-3 w-3 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <button>
                    <StatusBadge status={participant.status} />
                </button>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button onClick={() => alert('Delete action placeholder')} className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </td>
        </tr>
    );
};