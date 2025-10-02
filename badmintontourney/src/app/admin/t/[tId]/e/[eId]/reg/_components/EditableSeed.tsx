'use client';

import { useUpdateSeed } from '@/hooks/useUpdateParticipants';
import { useState, useEffect, useRef } from 'react';
import { useParticipantContext } from '../_context/ParticipantManagerContext';
import toast from 'react-hot-toast';

interface EditableSeedProps {
  participantId: string;
  initialSeed: number | null;

}

export const EditableSeed = ({ participantId, initialSeed }: EditableSeedProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [seedValue, setSeedValue] = useState(initialSeed?.toString() || '');
  const {mutate: updateSeed, isPending, error: seedUpdateError} = useUpdateSeed();
  const {eventId, totalCount} = useParticipantContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const newSeed = seedValue === '' ? null : parseInt(seedValue, 10);
    if(!newSeed){
      toast.error("Please enter seed value to update.", {
        duration: 3000
      });
      return;
    }

    if(newSeed > totalCount){
      toast.error(`Seed cannot be greater than total participants: ${totalCount}`, {
        duration: 5000
      });
      return;
    }
    updateSeed(eventId, participantId, newSeed);
    if (newSeed !== initialSeed) {
        updateSeed({
            event_id: eventId,
            participant_id: participantId,
            seed: newSeed
        })
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setSeedValue(initialSeed?.toString() || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative w-16 h-8">
        <input
          ref={inputRef}
          type="number"
          value={seedValue}
          onChange={(e) => setSeedValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full h-full rounded-md border-gray-300 shadow-sm text-sm p-1"
          placeholder="N/A"
          disabled={isPending}
        />
        {isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-md">
            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      title="double click to edit"
      onDoubleClick={() => setIsEditing(true)}
      className="relative w-16 h-8 flex items-center cursor-pointer group rounded-md py-1 gap-2"
    >
      <span className={isPending ? 'invisible' : ''}>
        {initialSeed || 'NA'}
      </span>
      {isPending && (
        <div className="absolute right-2 animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full" />
      )}
    </div>
  );
};