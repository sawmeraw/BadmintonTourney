'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createTournament, updateTournament, type FormState } from '@/lib/actions/TournamentActions';
import { Button } from '@/components/utils/Button';

type Tournament = { id: string, name: string, [key: string]: any };
type Location = { id: string, name: string };

interface TournamentFormProps {
  initialData?: Tournament | null;
  locations: Location[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Tournament')}
    </Button>
  );
}

export function TournamentForm({ initialData, locations }: TournamentFormProps) {
  const isEditing = !!initialData;
  const initialState: FormState = { success: false, message: '' };
  const actionToCall = isEditing ? updateTournament.bind(null, initialData.id) : createTournament;
  
  const [state, formAction] = useFormState(actionToCall, initialState);

  return (
    <form action={formAction} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {!state.success && state.message && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state.success && state.message && (
        <div className="mb-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-700">
          {state.message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tournament Name</label>
          <input type="text" name="name" id="name" defaultValue={initialData?.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="start_date" id="start_date" defaultValue={initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            {state.errors?.start_date && <p className="mt-1 text-sm text-red-600">{state.errors.start_date[0]}</p>}
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="end_date" id="end_date" defaultValue={initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
             {state.errors?.end_date && <p className="mt-1 text-sm text-red-600">{state.errors.end_date[0]}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
          <select id="location_id" name="location_id" defaultValue={initialData?.location_id || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select a location</option>
            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
           {state.errors?.location_id && <p className="mt-1 text-sm text-red-600">{state.errors.location_id[0]}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={initialData?.description || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-end">
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}