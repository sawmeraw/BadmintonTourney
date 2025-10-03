'use client';
import { useState } from 'react';

type Player = { id: string; first_name: string; last_name: string | null };

export const PlayerInput = ({
  playerNumber,
  allPlayers,
  value,
  onChange,
}: {
  playerNumber: number;
  allPlayers: Player[];
  value: any;
  onChange: (value: any) => void;
}) => {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const inputClassName = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5";

  const handleModeChange = (newMode: 'existing' | 'new') => {
    setMode(newMode);
    onChange(newMode === 'existing' ? { mode: 'existing', player_id: '' } : { mode: 'new', first_name: '', last_name: '' });
  };

  return (
    <div className="bg-white p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Player {playerNumber}</label>
      <div className="flex items-center gap-4 mb-4 border-b pb-3">
        <button type="button" onClick={() => handleModeChange('existing')} className={`text-sm ${mode === 'existing' ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>
          Select Existing
        </button>
        <button type="button" onClick={() => handleModeChange('new')} className={`text-sm ${mode === 'new' ? 'font-semibold text-emerald-600' : 'text-gray-500'}`}>
          Create New
        </button>
      </div>
      
      {mode === 'existing' ? (
        <select 
          required
          value={value?.player_id || ''}
          onChange={(e) => onChange({ mode: 'existing', player_id: e.target.value })}
          className={inputClassName}
        >
          <option value="">Select a player...</option>
          {allPlayers.map(p => (
            <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
          ))}
        </select>
      ) : (
        <div className="space-y-2">
          <input 
            required
            type="text" 
            placeholder="First Name" 
            value={value?.first_name || ''}
            onChange={(e) => onChange({ ...value, mode: 'new', first_name: e.target.value })}
            className={inputClassName}
          />
          <input 
            required
            type="text" 
            placeholder="Last Name" 
            value={value?.last_name || ''}
            onChange={(e) => onChange({ ...value, mode: 'new', last_name: e.target.value })}
            className={inputClassName}
          />
        </div>
      )}
    </div>
  );
};