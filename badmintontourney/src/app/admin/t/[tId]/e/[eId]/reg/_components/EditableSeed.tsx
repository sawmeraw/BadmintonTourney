'use client';

import { useUpdateParticipants } from '@/hooks/useUpdateParticipants';
import { useState, useEffect, useRef } from 'react';

interface EditableSeedProps {
  participantId: string;
  initialSeed: number | null;

}

export const EditableSeed = ({ participantId, initialSeed }: EditableSeedProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [seedValue, setSeedValue] = useState(initialSeed?.toString() || '');
  const {mutate: updateSeed, isPending} = useUpdateParticipants();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const newSeed = seedValue === '' ? null : parseInt(seedValue, 10);
    if (newSeed !== initialSeed) {
        updateSeed({
            updates:[{
                id: participantId,
                setSeed: newSeed,
            }]
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
      <div className="relative w-12 h-8">
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
      onDoubleClick={() => setIsEditing(true)}
      className="flex items-center cursor-pointer group rounded-md px-2 py-1 -ml-2"
    >
      <span>{initialSeed || 'Unseeded'}</span>
    </div>
  );
};