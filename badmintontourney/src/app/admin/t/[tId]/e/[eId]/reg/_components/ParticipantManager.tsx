'use client';

import { useState } from 'react';
import { Button } from '@/components/utils/Button';
import { AddParticipantModal } from './ParticipantModal';
import { ParticipantRow } from './ParticipantRow';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { PlayerBase } from '@/lib/types/api';
import { BulkActionBar } from './BulkActionBar';
import { useParticipantContext } from '../_context/ParticipantManagerContext';

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

export interface ParticipantManagerUIProps {
  eventType: {
    is_doubles: boolean;
  };
  allPlayers: PlayerBase[];
}

export function ParticipantManagerUI({ eventType, allPlayers } : ParticipantManagerUIProps) {
    const {
        eventId,
        participants, 
        totalCount, 
        page, 
        pageSize, 
        isLoading, 
        isError,
        selectedIds,
        handleSelectAll,
        areAllSelected
    } = useParticipantContext();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (isLoading && participants.length === 0) return <TableSkeleton />;
    if (isError) return <div>Error fetching participants.</div>;

    return (
        <>
            <div className="flex items-center justify-between my-6">
                <h2 className="text-2xl font-semibold">Participant Roster ({totalCount})</h2>
                <Button onClick={() => setIsModalOpen(true)}>+ Add Participant</Button>
            </div>

            <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
                {selectedIds.length > 0 && <BulkActionBar />}
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600"
                                    checked={areAllSelected}
                                    onChange={handleSelectAll}
                                    ref={input => {
                                        if (input) input.indeterminate = selectedIds.length > 0 && !areAllSelected;
                                    }}
                                />
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">{selectedIds.length > 0 ? "" : "Player(s)"}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seed</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-middle text-sm font-semibold text-gray-900">Actions</th>
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
                pageSize={pageSize}
                currentPage={page}
            />

            <AddParticipantModal
                eventId={eventId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isDoubles={eventType.is_doubles}
                allPlayers={allPlayers}
            />
        </>
    );
}