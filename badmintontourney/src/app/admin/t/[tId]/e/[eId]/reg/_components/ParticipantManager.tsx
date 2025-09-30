'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/utils/Button';
import { AddParticipantModal } from './ParticipantModal';
import { ParticipantRow } from './ParticipantRow';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { PlayerBase, PlayerSummary, type ParticipantListApiResponse } from '@/lib/types/api';
import { Participant } from '@/supabase/queryTypes';
import { useParticipants } from '@/hooks/useParticipants';

const PAGE_SIZE = 20;

const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="h-10 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-32"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                    <div className="h-11 w-11 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        ))}
        </div>
    </div>
);

export interface ParticipantManagerProps {
  eventId: string;
  eventType: {
    is_doubles: boolean;
  };
  allPlayers: PlayerBase[]; 
}

export function ParticipantManager({ eventId, eventType, allPlayers } : ParticipantManagerProps) {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError } = useParticipants(eventId, page, PAGE_SIZE);

    if (isLoading) return <TableSkeleton />;
    if (isError) return <div>Error fetching participants.</div>;

    const participants = data?.participants || [];
    const totalCount = data?.totalCount || 0;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Participant Roster</h2>
                    <p className="text-gray-500">{totalCount} entries</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ Add Participant</Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Player(s)</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seed</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {participants.map(participant => (
                            <ParticipantRow key={participant.id} participant={participant} />
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                currentPage={page}
            />

            <AddParticipantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isDoubles={eventType.is_doubles}
                eventId={eventId}
                allPlayers={allPlayers}
            />
        </>
    );
}