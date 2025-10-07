"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import { AddParticipantModal } from "./ParticipantModal";
import { ParticipantRow } from "./ParticipantRow";
import { PaginationControls } from "@/components/utils/PaginationControls";
import { PlayerBase } from "@/lib/types/api";
import { BulkActionBar } from "./BulkActionBar";
import { Tooltip } from "@/components/utils/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useParticipantContext } from "../_context/ParticipantManagerContext";
import TableSkeleton from "@/components/utils/TableSkeleton";
import StatusModal from "./StatusModal";

export interface ParticipantManagerUIProps {
    eventConfig: {
        tournamentRegistrationClosed: boolean;
        age_lower_limit: number | null;
        age_upper_limit: number | null;
        created_at: string;
        id: string;
        is_doubles: boolean;
        name: string;
        updated_at: string;
        max_participants: number | null;
        current_entries: number | null;
        finalised_for_matches: boolean | null;
    };
    allPlayers: PlayerBase[];
}

export function ParticipantManagerUI({
    eventConfig,
    allPlayers,
}: ParticipantManagerUIProps) {
    const {
        eventId,
        participants,
        totalCount,
        page,
        pageSize,
        isLoading,
        isUpdating,
        isError,
        selectedIds,
        isStatusModalOpen,
        handleSelectAll,
        areAllSelected,
        updateStatusSelected,
    } = useParticipantContext();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    if (isLoading && participants.length === 0)
        return <TableSkeleton numRows={5} numCols={4} />;
    if (isError) return <div>Error fetching participants.</div>;

    return (
        <>
            {isUpdating && (
                <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                </div>
            )}
            <div className="flex items-center justify-between my-6">
                <h2 className="text-2xl font-semibold">
                    Participant Roster ({totalCount})
                </h2>
                {eventConfig.tournamentRegistrationClosed ||
                eventConfig.finalised_for_matches ? (
                    <div className="flex gap-2 items-center">
                        <Tooltip message="Registration is closed on tournament level or matches have been created">
                            <InformationCircleIcon className="h-8 w-8 text-emerald-500 cursor-pointer hover:text-emerald-700 duration-300" />
                        </Tooltip>
                        <Button variant="contained" disabled>
                            Registration Closed
                        </Button>
                    </div>
                ) : eventConfig.max_participants !== null &&
                  eventConfig.current_entries !== null &&
                  eventConfig.current_entries >=
                      eventConfig.max_participants ? (
                    <div className="flex gap-2 items-center">
                        <Tooltip message="Current entries have reached max participants set for the event">
                            <InformationCircleIcon className="h-8 w-8 text-yellow-500 cursor-pointer hover:text-emerald-700 duration-300" />
                        </Tooltip>
                        <Button variant="contained" color="warning" disabled>
                            Max Participants Reached
                        </Button>
                    </div>
                ) : (
                    <Button onClick={() => setIsModalOpen(true)}>
                        + Add Participant
                    </Button>
                )}
            </div>

            <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
                {selectedIds.length > 0 && <BulkActionBar />}
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="relative px-7 sm:w-12 sm:px-6"
                            >
                                <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-emerald-600"
                                    checked={areAllSelected}
                                    onChange={handleSelectAll}
                                    ref={(input) => {
                                        if (input)
                                            input.indeterminate =
                                                selectedIds.length > 0 &&
                                                !areAllSelected;
                                    }}
                                />
                            </th>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                                {selectedIds.length > 0 ? "" : "Player(s)"}
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Seed
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-middle text-sm font-semibold text-gray-900"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {participants.map((participant) => (
                            <ParticipantRow
                                key={participant.id}
                                participant={participant}
                            />
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
                isDoubles={eventConfig.is_doubles}
                allPlayers={allPlayers}
            />

            <StatusModal isOpen={isStatusModalOpen} />
        </>
    );
}
