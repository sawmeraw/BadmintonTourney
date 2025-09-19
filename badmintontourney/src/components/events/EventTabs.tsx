'use client';

import { useState } from 'react';
import { BracketsTab } from './BracketsTab';
import { ParticipantsTab } from './ParticipantsTab';

type Round = { id: string; name: string; sequence: number };
interface EventTabsProps {
    eventId: string;
    initialDescription: string | null;
    rounds: Round[];
}

export function EventTabs({ eventId, initialDescription, rounds }: EventTabsProps) {
    const [activeTab, setActiveTab] = useState('Overview');
    const tabs = ['Overview', ...rounds.sort((a,b) => a.sequence - b.sequence).map(r => r.name), 'Participants'];

    return (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 flex-grow">

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 px-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 min-h-[400px]">
                {activeTab === 'Overview' && (
                    <div className="prose max-w-none text-gray-600">
                        <p>{initialDescription}</p>
                    </div>
                )}
                {activeTab === 'Participants' && (
                    <ParticipantsTab eventId={eventId} />
                )}
                
                {rounds.map(round => (
                    activeTab === round.name && <BracketsTab key={round.id} round={round} />
                ))}
            </div>
        </div>
    );
}