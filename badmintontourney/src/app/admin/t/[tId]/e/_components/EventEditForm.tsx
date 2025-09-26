'use client';

import { Button } from "@/components/utils/Button";
import { LinkButton } from "@/components/utils/LinkButton";
import { createTournamentAction, FormState, updateTournamentAction } from "@/lib/actions/TournamentActions";
import { Event } from "@/supabase/queryTypes";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormLabel } from "@/components/utils/FormLabel";


type EventTypeFormOption = { id: string, name: string };
type TemplateFormOption = { id: string, name: string };
interface TournamentFormProps{
  initialData?: Event & {tournaments: {name: string}} | null;
  eventTypes: EventTypeFormOption[];
  templates: TemplateFormOption[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Tournament')}
    </Button>
  );
}

export default function EventEditForm({initialData, eventTypes, templates} : TournamentFormProps){
  const isEditing = !!initialData;
  const initialState: FormState = {message: '', success: false};

  const actionToCall = isEditing ? updateTournamentAction.bind(null, initialData.id) : createTournamentAction;
  const [state, formAction] = useActionState(actionToCall, initialState);

  return (
    <></>
  );

}