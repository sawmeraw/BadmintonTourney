'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '@/components/utils/Button';

interface AddParticipantModalProps{
    isOpen: boolean;
    onClose: ()=>void;
    isDoubles: boolean;
}

export function AddParticipantModal({ isOpen, onClose, isDoubles } : AddParticipantModalProps) {
    const [mode, setMode] = useState<'existing' | 'new'>('existing');

    const handleAdd = () => {
        // TODO: This will call a server action or API route
        alert('Adding participant (placeholder)');
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Add {isDoubles ? 'Team' : 'Participant'}
                    </DialogTitle>

                    {/* Mode Toggle */}
                    <div className="mt-4 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setMode('existing')} className={`${mode === 'existing' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}>
                                Add Existing Player
                            </button>
                            <button onClick={() => setMode('new')} className={`${mode === 'new' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}>
                                Create New Player
                            </button>
                        </nav>
                    </div>

                    <div className="mt-6 space-y-4">
                        {mode === 'existing' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select {isDoubles ? 'Player 1' : 'Player'}</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    {/* TODO: Populate with all players */}
                                    <option>Existing Player 1</option>
                                    <option>Existing Player 2</option>
                                </select>
                                {isDoubles && (
                                   <div className="mt-4">
                                     <label className="block text-sm font-medium text-gray-700">Select Player 2</label>
                                     <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                         <option>Existing Player A</option>
                                         <option>Existing Player B</option>
                                     </select>
                                   </div>
                                )}
                            </div>
                        )}
                        {mode === 'new' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                <label className="mt-2 block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleAdd}>Add Participant</Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}