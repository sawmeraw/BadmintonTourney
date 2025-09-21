'use client';
import type { EventRoundDetailsApiResponse } from "@/lib/types/api";
import { useState } from 'react';
import { ParticipantMatches } from './ParticipantMatches';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { buildStandings, getStandings } from "../utils/ui";

export const PoolsView = ({ data }: { data: EventRoundDetailsApiResponse }) => {
    const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null);

    const handleToggle = (participantId: string) => {
        setExpandedParticipantId(prevId => (prevId === participantId ? null : participantId));
    };
    const standingsMap = buildStandings(data.matches);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Pool Standings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {data.groups.map(group => (
                    <div key={group.id} className="rounded-lg border-teal-400 border-2 bg-white shadow-sm">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-emerald-700">{group.name}</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {group.participants.map((p, index) => {
                                const standings = getStandings(p.id, standingsMap);
                                const isExpanded = expandedParticipantId === p.id;

                                return (
                                    <div key={p.id}>
                                        <button
                                            onClick={() => handleToggle(p.id)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold text-gray-500 w-6 mr-2">{index + 1}</span>
                                                <span>
                                                    {p.player1.first_name} {p.player1.last_name}
                                                    {p.player2 && ` / ${p.player2.first_name} ${p.player2.last_name}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-mono text-sm mr-4">{standings.wins}W - {standings.losses}L</span>
                                                <ChevronDownIcon
                                                    className={`h-5 w-5 text-gray-400 transition-transform ${
                                                        isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </div>
                                        </button>
                                        {isExpanded && (
                                            <ParticipantMatches
                                                participantId={p.id}
                                                matches={data.matches}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};