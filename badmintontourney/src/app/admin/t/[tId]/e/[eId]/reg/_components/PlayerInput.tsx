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
      <div className="flex items-center gap-4 mb-4 pb-3">
        <button type="button" onClick={() => handleModeChange('existing')} className={`text-sm cursor-pointer px-1 py-2 rounded duration-300 ${mode === 'existing' ? 'font-semibold bg-emerald-600 text-white' : 'text-black bg-gray-300'}`}>
          Select Existing
        </button>
        <button type="button" onClick={() => handleModeChange('new')} className={`text-sm px-1 py-2 rounded cursor-pointer ${mode === 'new' ? 'font-semibold bg-emerald-600 text-white' : 'text-black bg-gray-300'}`}>
          Create New
        </button>
      </div>
      
      <div className={`transition-all duration-800 overflow-hidden ${mode === "existing" ? 'max-h-20' : 'max-h-40'}` }>
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
    </div>
  );
};