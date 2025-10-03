'use client';

import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button } from '@/components/utils/Button';
import { PlayerBase } from '@/lib/types/api';
import { PlayerInput } from './PlayerInput';

interface AddParticipantModalProps{
    isOpen: boolean;
    onClose: ()=>void;
    isDoubles: boolean;
    eventId: string;
    allPlayers: PlayerBase[];
}

export function AddParticipantModal({ isOpen, onClose, isDoubles, eventId, allPlayers } : AddParticipantModalProps) {
  const [formState, setFormState] = useState({
    player1: { mode: 'existing', player_id: '' },
    player2: { mode: 'existing', player_id: '' },
    seed: '',
    autoSeed: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      event_id: eventId,
      event_type: isDoubles ? 'doubles' : 'singles',
      player1: formState.player1,
      player2: isDoubles ? formState.player2 : undefined,
      seed: formState.seed ? parseInt(formState.seed, 10) : undefined,
      autoSeed: formState.autoSeed,
      status: 'active'
    };

    alert('Payload logged to console. Ready for API integration.');
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative top-1/2 left-1/2 z-50">
        
          <TransitionChild 
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50 rounded-lg" aria-hidden="true" />
            </TransitionChild>
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white pt-5">
                  <DialogTitle className="text-xl font-semibold text-gray-900 px-4">
                    Add {isDoubles ? 'Team' : 'Participant'}
                  </DialogTitle>

                  <form onSubmit={handleSubmit} className="mt-2">
                    <PlayerInput
                      playerNumber={1}
                      allPlayers={allPlayers}
                      value={formState.player1}
                      onChange={(val) => setFormState(prev => ({ ...prev, player1: val }))}
                    />

                    {isDoubles && (
                      <PlayerInput
                        playerNumber={2}
                        allPlayers={allPlayers}
                        value={formState.player2}
                        onChange={(val) => setFormState(prev => ({ ...prev, player2: val }))}
                      />
                    )}
                    
                    <div className="bg-gray-200 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Seed (optional)</label>
                          <span className="text-xs">Either set manually or autoseed.</span>
                          <input 
                            type="number"
                            value={formState.seed}
                            onChange={(e) => setFormState(prev => ({ ...prev, seed: e.target.value, autoSeed: !e.target.value }))}
                            disabled={formState.autoSeed}
                            className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 disabled:bg-gray-200"
                          />
                        </div>
                        <div className="relative flex items-center">
                          <div className="flex h-6 items-center">
                            <input
                              id="autoSeed"
                              type="checkbox"
                              checked={formState.autoSeed}
                              onChange={(e) => setFormState(prev => ({ ...prev, autoSeed: e.target.checked, seed: '' }))}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="autoSeed" className="font-medium text-gray-900">Auto-seed</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end bg-gray-50 space-x-4 px-4 py-2">
                      <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                      <Button type="submit">Confirm</Button>
                    </div>
                  </form>
                </div>
            </DialogPanel>
          </div>
      </Dialog>
    </Transition>
    
  );
}