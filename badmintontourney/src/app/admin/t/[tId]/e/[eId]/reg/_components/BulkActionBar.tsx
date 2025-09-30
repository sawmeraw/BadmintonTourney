'use client';

import { Button } from '@/components/utils/Button';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  disableUnseedButton: boolean;
  onDelete: () => void;
  onRemoveSeed: () => void;
  onSetStatus: (status: 'active' | 'withdrawn' | 'disqualified') => void;
}

export const BulkActionBar = ({ selectedCount, onClearSelection, onDelete, onRemoveSeed, onSetStatus, disableUnseedButton }: BulkActionBarProps) => {
  return (
    <div className="absolute top-0 left-2 right-0 flex h-12 items-center z-50 space-x-3 pr-4 bg-gray-50 sm:left-16">
      <p className="text-sm font-medium">{selectedCount} selected</p>
      <button
        type="button"
        className="rounded-md px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
        onClick={onClearSelection}
      >
        Clear selection
      </button>
      <div className="flex-grow" />
      <Button variant="secondary" size="sm" onClick={() => onSetStatus('active')}>Update Status</Button>
      <Button disabled={disableUnseedButton} variant="secondary" size="sm" onClick={onRemoveSeed}>Remove Seed</Button>
      <Button variant="secondary" size="sm" onClick={onDelete} className="text-red-700 hover:bg-red-50">Delete</Button>
    </div>
  );
};