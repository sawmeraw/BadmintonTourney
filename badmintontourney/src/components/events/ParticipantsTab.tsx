'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useParticipants } from '@/hooks/useParticipants';
import { PaginationControls } from '../utils/PaginationControls';
import { StatusBadge } from '../utils/StatusBadge';
import { type ParticipantListApiResponse } from '@/lib/types/api';

const PAGE_SIZE = 10;

const PlayerCell = ({ 
  player1, 
  player2 
}: { 
  player1: ParticipantListApiResponse['participants'][0]['player1'], 
  player2: ParticipantListApiResponse['participants'][0]['player2'] 
}) => {
  return (
    <div className="flex items-center">
      <div className="ml-4">
        <Link href={`/players/${player1.id}`} className="font-medium text-gray-900 hover:text-emerald-600">
          {player1.first_name} {player1.last_name}
        </Link>
        
        {player2 && (
          <>
            <br />
            <Link href={`/players/${player2.id}`} className="font-medium text-gray-900 hover:text-emerald-600">
              {player2.first_name} {player2.last_name}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>
        <div className="space-y-4 mt-8">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                    <div className="h-11 w-11 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
        ))}
        </div>
    </div>
);

export function ParticipantsTab({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  
  const { data, isLoading, isError, error } = useParticipants(eventId, page, PAGE_SIZE);

  if (isLoading) return <TableSkeleton />;
  if (isError) return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  if (!data || data.participants.length === 0) {
    return <div className="text-center py-10 text-gray-500">No participants have registered yet.</div>;
  }

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">
            Registered Participants ({data.totalCount})
        </h2>
        <div className="flow-root">
            <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Player(s)</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seed</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.participants.map((p) => (
                        <tr key={p.id}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                <PlayerCell player1={p.player1} player2={p.player2} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{p.seed || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <StatusBadge status={p.status} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{p.player1.state}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>

        <PaginationControls
            totalCount={data.totalCount}
            pageSize={PAGE_SIZE}
            currentPage={page}
        />
    </div>
  );
}