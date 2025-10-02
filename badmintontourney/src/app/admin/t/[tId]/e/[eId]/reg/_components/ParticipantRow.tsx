'use client';

import { StatusBadge } from '@/components/utils/StatusBadge';
import { ParticipantApiResponse,  } from '@/lib/types/api';
import { TrashIcon } from '@heroicons/react/24/solid';
import { EditableSeed } from './EditableSeed';
import Link from 'next/link';
import { useParticipantContext } from '../_context/ParticipantManagerContext';
interface ParticipantRowProps{
    participant: ParticipantApiResponse;
}

export const ParticipantRow = ({participant} : ParticipantRowProps) => {
  const { selectedIds, toggleRow, areAllSelected, deleteSingle} = useParticipantContext();
  const isSelected = selectedIds.includes(participant.id);
  
  return (
    <tr className={isSelected ? 'bg-emerald-50' : undefined}>
      <td className="relative px-7 sm:w-12 sm:px-6">
        {isSelected && <div className="absolute inset-y-0 left-0 w-0.5 bg-emerald-600" />}
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600"
          checked={isSelected}
          onChange={() => toggleRow(participant.id)}
        />
      </td>
      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
        <Link href={`/players/${participant.player1.id}`} className="hover:text-emerald-600">
            {participant.player1.first_name} {participant.player1.last_name || ''}
        </Link>
        {participant.player2 && (
            <>
                {' / '}
                <Link href={`/players/${participant.player2.id}`} className="hover:text-emerald-600">
                    {participant.player2.first_name} {participant.player2.last_name || ''}
                </Link>
            </>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <EditableSeed participantId={participant.id} initialSeed={participant.seed}/>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <StatusBadge status={participant.status} />
      </td>
      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6 ">
        <button disabled={areAllSelected || isSelected} title={(areAllSelected || isSelected) ? "": "Delete Participant?"} className={`px-4 py-1 ${(areAllSelected || isSelected) ? "" : "hover:bg-gray-200"} duration-300`} onClick={()=>deleteSingle(participant.id)}>
          <TrashIcon className={`h-6 w-6  ${(areAllSelected || isSelected) ? "text-gray-200" : "text-red-500"} transition-all`} />
        </button>
      </td>
    </tr>
  );
};