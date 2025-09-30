'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/utils/Button';
import { AddParticipantModal } from './ParticipantModal';
import { ParticipantRow } from './ParticipantRow';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { PlayerBase } from '@/lib/types/api';
import { useParticipants } from '@/hooks/useParticipants';
import { BulkActionBar } from './BulkActionBar';
import { useUpdateParticipants } from '@/hooks/useUpdateParticipants';
import { UpdateParticipantPayload } from '@/lib/types/writes';

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

export function ParticipantManager({ eventId, eventType, allPlayers}: ParticipantManagerProps) {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const { data, isLoading, isError } = useParticipants(eventId, page, PAGE_SIZE);
    const {mutate: updateParticipant, isPending} = useUpdateParticipants();

    const participants = data?.participants || [];
    const totalCount = data?.totalCount || 0;
    const disableBulkUnseed = participants.every(item =>item.seed == null); 

    const selectedCount = selectedIds.length;
    const areAllSelected = useMemo(() => 
        participants.length > 0 && selectedCount === participants.length, 
        [selectedCount, participants.length]
    );

    const handleToggleRow = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(participants.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleOnRowDelete = (id: string)=>{
        updateParticipant({
            updates:[{
                id: id,
                isDeleted: true
            }]
        })
    }

    const handleRemoveSeeds = ()=>{
        let updateObj : UpdateParticipantPayload = {
            updates: selectedIds.map((id)=>({
                id: id,
                removeSeed: true,
            }))
        }
        updateParticipant(updateObj);
    }

    if (isLoading) return <TableSkeleton />;
    if (isError) return <div>Error fetching participants.</div>;

    return (
        <>
        {isPending && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            </div>
        )}
            <div className="flex items-center justify-between my-6">
                <div>
                    <h2 className="text-2xl font-bold">Participant Roster</h2>
                    <p className="text-gray-500">{totalCount} entries</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ Add Participant</Button>
            </div>

            <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
                {selectedCount > 0 && (
                    <BulkActionBar
                        disableUnseedButton={disableBulkUnseed}
                        selectedCount={selectedCount}
                        onClearSelection={() => setSelectedIds([])}
                        onDelete={() => alert(`Deleting ${selectedCount} participants...`)}
                        onRemoveSeed={() => handleRemoveSeeds()}
                        onSetStatus={(status) => alert(`Setting status to ${status} for ${selectedCount} participants...`)}
                    />
                )}
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
                                        if (input) input.indeterminate = selectedCount > 0 && !areAllSelected;
                                    }}
                                />
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">{selectedCount > 0 ? "" : "Player(s)"}</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seed</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-middle text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {participants.map(participant => (
                            <ParticipantRow
                                key={participant.id}
                                participant={participant}
                                isSelected={selectedIds.includes(participant.id)}
                                onToggle={handleToggleRow}
                                onDelete={handleOnRowDelete}
                                allSelected={areAllSelected}
                            />
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