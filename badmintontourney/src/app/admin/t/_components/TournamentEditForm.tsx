'use client';

import { Button } from "@/components/utils/Button";
import { createTournament, FormState, updateTournament } from "@/lib/actions/TournamentActions";
import { Tournament } from "@/supabase/queryTypes";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

type LocationFormOption = { id: string, name: string };
interface TournamentFormProps{
  initialData?: Tournament | null;
  locations: LocationFormOption[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Tournament')}
    </Button>
  );
}

const FormLabel = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900">
    {children}
  </label>
);

export default function TournamentEditForm({initialData, locations} : TournamentFormProps){
  const isEditing = !!initialData;
  const initialState: FormState = {message: '', success: false};

  const actionToCall = isEditing ? updateTournament.bind(null, initialData.id) : createTournament;
  const [state, formAction] = useActionState(actionToCall, initialState);

  const [locationId, setLocationId] = useState(initialData?.location_id || '');

  return (
    <form action={formAction}>
      {state.message && (
        <div className={`mb-6 flex items-center gap-x-3 rounded-md p-4 text-sm ${
          state.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {state.success ? <CheckCircleIcon className="h-5 w-5" /> : <InformationCircleIcon className="h-5 w-5" />}
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">Tournament Details</h2>
            <p className="mt-1 text-sm text-gray-600">
              Basic information for your tournament.
            </p>

            <div className="mt-6 space-y-6">
              
              <div>
                <FormLabel htmlFor="name">Tournament Name</FormLabel>
                <input type="text" name="name" id="name" defaultValue={initialData?.name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="start_date">Start Date</FormLabel>
                  <input type="date" name="start_date" id="start_date" defaultValue={initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                  {state.errors?.start_date && <p className="mt-1 text-sm text-red-600">{state.errors.start_date[0]}</p>}
                </div>
                <div>
                  <FormLabel htmlFor="end_date">End Date</FormLabel>
                  <input type="date" name="end_date" id="end_date" defaultValue={initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                  {state.errors?.end_date && <p className="mt-1 text-sm text-red-600">{state.errors.end_date[0]}</p>}
                </div>
              </div>

              <div>
                <FormLabel htmlFor="description">Description</FormLabel>
                <textarea id="description" name="description" rows={5} defaultValue={initialData?.description || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
              </div>
               <div>
                <FormLabel htmlFor="banner_url">Banner Image URL</FormLabel>
                <input type="url" name="banner_url" id="banner_url" defaultValue={initialData?.banner_url || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="https://example.com/image.png" />
              </div>
            </div>
          </div>
          
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">Logistics & Information</h2>
             <div className="mt-6 space-y-6">
                <div>
                    <FormLabel htmlFor="shuttle_info">Shuttlecock Info</FormLabel>
                    <input type="text" name="shuttle_info" id="shuttle_info" defaultValue={initialData?.shuttle_info || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., Yonex Aerosensa 30" />
                </div>
                <div>
                    <FormLabel htmlFor="food_info">Food & Refreshments</FormLabel>
                    <textarea id="food_info" name="food_info" rows={3} defaultValue={initialData?.food_info || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
                </div>
                <div>
                    <FormLabel htmlFor="parking_info">Parking Information</FormLabel>
                    <textarea id="parking_info" name="parking_info" rows={3} defaultValue={initialData?.parking_info || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
                </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Settings</h2>
                <div>
                    <FormLabel htmlFor="location_id">Location</FormLabel>
                    <select id="location_id" name="location_id" defaultValue={initialData?.location_id || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="">Select a location</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                    {state.errors?.location_id && <p className="mt-1 text-sm text-red-600">{state.errors.location_id}</p>}
                </div>
                 <div>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <select id="status" name="status" defaultValue={initialData?.status || 'upcoming'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                 <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input id="is_registration_closed" name="is_registration_closed" type="checkbox" defaultChecked={initialData?.is_registration_closed || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="is_registration_closed" className="font-medium text-gray-900">Close Registration</label>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                    <SubmitButton isEditing={isEditing} />
                </div>
            </div>
        </div>
      </div>
    </form>
  );

}