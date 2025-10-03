"use client";

import { useParticipants } from "@/hooks/useParticipants";
import { useUpdateParticipants } from "@/hooks/useUpdateParticipants";
import { ParticipantApiResponse } from "@/lib/types/api";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface ParticipantContextType {
    eventId: string;
    participants: ParticipantApiResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    isUpdating: boolean;
    isError: boolean;
    selectedIds: string[];
    toggleRow: (id: string) => void;
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    areAllSelected: boolean;
    disableBulkUnseed: boolean;
    deleteSelected: () => void;
    deleteSingle: (id: string)=>void;
    removeSeedFromSelected: () => void;
    clearSelection: () => void;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

const PAGE_SIZE = 15;

export const ParticipantProvider = ({ eventId, children }: { eventId: string, children: ReactNode }) => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const { data, isLoading, isError } = useParticipants(eventId, page, PAGE_SIZE);
    const { mutate: updateParticipant, isPending: isUpdating } = useUpdateParticipants();

    const participants = data?.participants || [];
    const totalCount = data?.totalCount || 0;
    const disableBulkUnseed = participants.every(item =>item.seed == null);

    const areAllSelected = useMemo(() => 
        participants.length > 0 && selectedIds.length === participants.length, 
        [selectedIds.length, participants.length]
    );

    const handleToggleRow = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? participants.map(p => p.id) : []);
    };
    
    const deleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} participant(s)?`)) {
            updateParticipant({ event_id: eventId, updates: selectedIds.map(id => ({ id, isDeleted: true })) });
            setSelectedIds([]);
        }
    };

    const deleteSingleWithId = (id: string)=>{
        updateParticipant({
            event_id: eventId,
            updates: [{
                id: id,
                isDeleted: true,
            }]
        })
        
    }

    const removeSeedFromSelected = () => {
        updateParticipant({ event_id: eventId, updates: selectedIds.map(id => ({ id, removeSeed: true })) });
        setSelectedIds([]);
    };

    const value = {
        eventId,
        participants,
        totalCount,
        page,
        pageSize: PAGE_SIZE,
        isLoading,
        isUpdating,
        isError,
        selectedIds,
        disableBulkUnseed,
        toggleRow: handleToggleRow,
        deleteSingle: deleteSingleWithId,
        handleSelectAll,
        areAllSelected,
        deleteSelected,
        removeSeedFromSelected,
        clearSelection: () => setSelectedIds([]),
    };

    return <ParticipantContext.Provider value={value}>{children}</ParticipantContext.Provider>;
};

export const useParticipantContext = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error('useParticipantContext must be used within a ParticipantProvider');
  }
  return context;
};
