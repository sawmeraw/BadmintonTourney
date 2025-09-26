'use client';

import { Button } from "@/components/utils/Button";
import { LinkButton } from "@/components/utils/LinkButton";
import { createTournamentAction, FormState, updateTournamentAction } from "@/lib/actions/TournamentActions";
import { Event } from "@/supabase/queryTypes";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormLabel } from "@/components/utils/FormLabel";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";


type EventTypeFormOption = { id: string, name: string };
type TemplateFormOption = { id: string, name: string };
interface TournamentFormProps{
  initialData?: Event & {tournaments: {name: string}} | null;
  eventTypes: EventTypeFormOption[];
  templates: TemplateFormOption[];
  tournamentId: string; 
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Tournament')}
    </Button>
  );
}

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{value}</dd>
    </div>
);

export default function EventEditForm({initialData, eventTypes, templates, tournamentId} : TournamentFormProps){
  const isEditing = !!initialData;
  const initialState: FormState = {message: '', success: false};

  const actionToCall = isEditing ? updateTournamentAction.bind(null, initialData.id) : createTournamentAction;
  const [state, formAction] = useActionState(actionToCall, initialState);

  const formActionWithId = (formData: FormData) =>{
    if(!isEditing){
        formData.append('tournament_id', tournamentId);
    }
    formAction(formData);
  }

  return (
    <form action={formActionWithId}>
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
                    <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                    <div className="mt-6 space-y-6">
                        <div>
                            <FormLabel htmlFor="name">Event Name</FormLabel>
                            <input type="text" name="name" id="name" defaultValue={initialData?.name || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                        </div>
                        <div>
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <textarea id="description" name="description" rows={4} defaultValue={initialData?.description || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></textarea>
                        </div>
                        <div>
                            <FormLabel htmlFor="notes">Notes</FormLabel>
                            <textarea id="notes" name="notes" rows={3} defaultValue={initialData?.notes || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></textarea>
                        </div>
                        <div>
                            <FormLabel htmlFor="sponsor_name">Sponsor name</FormLabel>
                            <input id="sponsor_name" name="sponsor_name" defaultValue={initialData?.sponsor_name || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></input>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Prizes & Fees</h2>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <FormLabel htmlFor="entry_fee">Entry Fee ($)</FormLabel>
                            <input type="number" name="entry_fee" id="entry_fee" defaultValue={initialData?.entry_fee || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                        </div>
                        <div>
                            <FormLabel htmlFor="first_prize_money">First Prize ($)</FormLabel>
                            <input type="number" name="first_prize_money" id="first_prize_money" defaultValue={initialData?.first_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                        </div>
                        <div>
                            <FormLabel htmlFor="second_prize_money">Second Prize ($)</FormLabel>
                            <input type="number" name="second_prize_money" id="second_prize_money" defaultValue={initialData?.second_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                        </div>
                        <div>
                            <FormLabel htmlFor="third_prize_money">Third Prize ($)</FormLabel>
                            <input type="number" name="third_prize_money" id="third_prize_money" defaultValue={initialData?.third_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
                    <dl className="mt-4 grid grid-cols-2 gap-5">
                       <StatCard label="Current Entries" value={initialData?.current_entries || 0} />
                       <StatCard label="Max Participants" value={initialData?.max_participants || 'N/A'} />
                    </dl>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
                    <div className="mt-6 space-y-6">
                        <div>
                            <FormLabel htmlFor="event_type_id">Event Type</FormLabel>
                            <select id="event_type_id" name="event_type_id" defaultValue={initialData?.event_type_id || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5">
                                <option value="">Select type...</option>
                                {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <FormLabel htmlFor="template_id">Tournament Format</FormLabel>
                            <select id="template_id" name="template_id" defaultValue={initialData?.template_id || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 disabled:bg-gray-200">
                                <option value="">Select format...</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                             {isEditing && <p className="mt-1 text-xs text-gray-500">Format cannot be changed after creation.</p>}
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input id="has_third_place_match" name="has_third_place_match" type="checkbox" defaultChecked={initialData?.has_third_place_match || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="has_third_place_match" className="font-medium text-gray-900">Include 3rd Place Match</label>
                            </div>
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input id="is_featured" name="is_featured" type="checkbox" defaultChecked={initialData?.is_featured || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="is_featured" className="font-medium text-gray-900">Show as Featured Event in the Tournament</label>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <SubmitButton isEditing={isEditing} />
                </div>
            </div>
        </div>
    </form>
  );

}