'use client';

// import { Button } from "@/components/utils/Button";
import Button from "@mui/material/Button";
import { LinkButton } from "@/components/utils/LinkButton";
import { Event } from "@/supabase/queryTypes";
import { startTransition, useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { FormLabel } from "@/components/utils/FormLabel";
import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { createEventAction, EventFormState, updateEventAction } from "@/lib/actions/EventActions";
import EventConfirmationModal from "@/components/events/EventConfirmationModal";


type EventTypeFormOption = { id: string, name: string };
type TemplateFormOption = { id: string, name: string };
interface EventFormProps{
  initialData?: Event & {tournaments: {name: string}} | null;
  eventTypes: EventTypeFormOption[];
  templates: TemplateFormOption[];
  tournamentId: string; 
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="contained" type="submit" color="primary" disabled={pending} className="w-full">
      {pending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Event')}
    </Button>
  );
}

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{value}</dd>
    </div>
);

export default function EventEditForm({initialData, eventTypes, templates, tournamentId} : EventFormProps){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const isEditing = !!initialData;
    const initialState: EventFormState = {message: '', success: false};

    const actionToCall = isEditing ? updateEventAction.bind(null, initialData.id, initialData.finalised_for_matches || false) : createEventAction.bind(null, tournamentId);
    const [state, formAction] = useActionState(actionToCall, initialState);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if(formData.get('finalised_for_matches')){
            setIsModalOpen(true);
        } else{
            startTransition(()=>{
                formAction(formData);
            });
        }
    }

    const handleConfirmFinalise = ()=>{
        const formData = new FormData(formRef.current!);
        startTransition(()=>{
            formAction(formData);
        })
        setIsModalOpen(false);
    }

    return (
    <>
        <form action={formAction} ref={formRef} onSubmit={handleSubmit} className="relative">
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
                                <input type="hidden" name="tournament_id" id="tournament_id" defaultValue={tournamentId}/>
                            </div>
                            <div>
                                <FormLabel htmlFor="name">Event Name</FormLabel>
                                <input type="text" name="name" id="name" defaultValue={initialData?.name || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <textarea id="description" name="description" rows={4} defaultValue={initialData?.description || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></textarea>
                                {state.errors?.description && <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="notes">Notes</FormLabel>
                                <textarea id="notes" name="notes" rows={3} defaultValue={initialData?.notes || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></textarea>
                                {state.errors?.notes && <p className="mt-1 text-sm text-red-600">{state.errors.notes[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="sponsor_name">Sponsor name</FormLabel>
                                <input id="sponsor_name" name="sponsor_name" defaultValue={initialData?.sponsor_name || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"></input>
                                {state.errors?.sponsor_name && <p className="mt-1 text-sm text-red-600">{state.errors.sponsor_name[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Prizes & Fees</h2>
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <FormLabel htmlFor="entry_fee">Entry Fee ($)</FormLabel>
                                <input type="number" name="entry_fee" id="entry_fee" defaultValue={initialData?.entry_fee || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.entry_fee && <p className="mt-1 text-sm text-red-600">{state.errors.entry_fee[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="first_prize_money">First Prize ($)</FormLabel>
                                <input type="number" name="first_prize_money" id="first_prize_money" defaultValue={initialData?.first_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.first_prize_money && <p className="mt-1 text-sm text-red-600">{state.errors.first_prize_money[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="second_prize_money">Second Prize ($)</FormLabel>
                                <input type="number" name="second_prize_money" id="second_prize_money" defaultValue={initialData?.second_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.second_prize_money && <p className="mt-1 text-sm text-red-600">{state.errors.second_prize_money[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="third_prize_money">Third Prize ($)</FormLabel>
                                <input type="number" name="third_prize_money" id="third_prize_money" defaultValue={initialData?.third_prize_money || 0} step="0.01" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.third_prize_money && <p className="mt-1 text-sm text-red-600">{state.errors.third_prize_money[0]}</p>}
                            </div>
                            <div className="col-span-2">
                                <FormLabel htmlFor="prize_details">Prize Details</FormLabel>
                                <textarea name="prize_details" id="prize_details" defaultValue={initialData?.prize_details || ""} rows={3} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                                {state.errors?.prize_details && <p className="mt-1 text-sm text-red-600">{state.errors.prize_details[0]}</p>}
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
                        <p className={ initialData?.finalised_for_matches ? `text-red-500 text-xs` : `text-blue-500 text-xs`}>{initialData?.finalised_for_matches ? "Cannot update configuration after creating matches." : "Configuration cannot be updated after finalizing." }</p>
                        <div className="mt-6 space-y-6">
                            <div>
                                <FormLabel htmlFor="event_type_id">Event Type</FormLabel>
                                <select id="event_type_id" name="event_type_id" defaultValue={initialData?.event_type_id || ''} disabled={initialData?.finalised_for_matches || false} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 disabled:bg-gray-200 disabled:text-gray-400">
                                    <option value="">Select type...</option>
                                    {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
                                </select>
                                {state.errors?.event_type_id && <p className="mt-1 text-sm text-red-600">{state.errors.event_type_id[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="max_participants">Max Participants</FormLabel>
                                <input type="number" name="max_participants" id="max_participants" defaultValue={initialData?.max_participants || 0} disabled={initialData?.finalised_for_matches || false} step="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 disabled:bg-gray-200 disabled:text-gray-400" />
                                {state.errors?.max_participants && <p className="mt-1 text-sm text-red-600">{state.errors.max_participants[0]}</p>}
                            </div>
                            <div>
                                <FormLabel htmlFor="template_id">Tournament Format</FormLabel>
                                <select id="template_id" name="template_id" defaultValue={initialData?.template_id || ''} disabled={initialData?.finalised_for_matches || false} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 disabled:bg-gray-200 disabled:text-gray-400">
                                    <option value="">Select format...</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                {state.errors?.template_id && <p className="mt-1 text-sm text-red-600">{state.errors.template_id[0]}</p>}
                                {isEditing && <p className="mt-1 text-xs text-gray-500">Format cannot be changed after creation.</p>}
                            </div>
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input id="has_third_place_match" name="has_third_place_match" type="checkbox" defaultChecked={initialData?.has_third_place_match || false} disabled={initialData?.finalised_for_matches || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="has_third_place_match" className={initialData?.finalised_for_matches ? `font-medium text-gray-400` : `font-medium text-gray-900`}>Include 3rd Place Match</label>
                                </div>
                            </div>
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input id="is_featured" name="is_featured" type="checkbox" defaultChecked={initialData?.is_featured || false} disabled={initialData?.finalised_for_matches || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="is_featured" className={initialData?.finalised_for_matches ? `font-medium text-gray-400` : `font-medium text-gray-900`}>Show as Featured Event in the Tournament</label>
                                </div>
                            </div>
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input id="finalised_for_matches" name="finalised_for_matches" type="checkbox" defaultChecked={initialData?.finalised_for_matches || false} disabled={initialData?.finalised_for_matches || false} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="finalised_for_matches" className={initialData?.finalised_for_matches ? `font-medium text-gray-400` : `font-medium text-gray-900`}>Finalize & Create Matches</label>
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
        <EventConfirmationModal
            isOpen={isModalOpen}
            onClose={()=>setIsModalOpen(false)}
            onConfirm={handleConfirmFinalise}
            currentEntries={initialData?.current_entries || 0}
            maxParticipants={initialData?.max_participants || 0}
            >
                
        </EventConfirmationModal>
    </>
  );

}