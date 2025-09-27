'use server';

import { revalidatePath } from "next/cache";
import { createEvent, updateEventWithId } from "../services/EventService";
import { updateEventSchema, createEventSchema } from "../types/writes";
import { redirect } from "next/navigation";

export type EventFormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    tournament_id?: string[];
    event_type_id?: string[];
    description?: string[];
    entry_fee?: string[];
    first_prize_money?: string[];
    second_prize_money?: string[];
    third_prize_money?: string[];
    prize_details?: string[];
    sponsor_name?: string[];
    max_participants?: string[];
    notes?: string[];
    is_featured?: string[];
    has_third_place_match?: string[];
    finalised_for_matches?: string[];
    template_id?: string[];
  };
//   values?: {
//     [k: string] : FormDataEntryValue;
//   };
};

export async function createEventAction(tournamentId: string, prevState: EventFormState, formData: FormData): Promise<EventFormState>{
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = createEventSchema.safeParse(rawFormData);
  if(!validatedFields.success){
    const {fieldErrors} = validatedFields.error.flatten();
    console.log(fieldErrors);
    return {
      message: "Form submission failed. Please check any errors below.",
      success: false,
      errors: fieldErrors,
    //   values: validatedFields.data
    }
  }

  let id: string;

  try{
    id = await createEvent(validatedFields.data);
    if(!id){
      return {
        message: "An unknown error occurred.",
        success: false,
      }
    }

    revalidatePath('/admin/events');
    redirect(`/admin/t/${tournamentId}/e/${id}`);
  } catch(error){
    const message = error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return {
      message:`Database error: ${message}`,
      success: false,
    }
  }
}


export async function updateEventAction(eventId:string, prevState: EventFormState, formData: FormData) : Promise<EventFormState>{
  const validatedFields = updateEventSchema.safeParse(Object.fromEntries(formData.entries()));

  if(!validatedFields.success){
    const {fieldErrors} = validatedFields.error.flatten();
    console.dir(fieldErrors, {depth: null});
    return {
      message: "Submission failed. Please check errors below.",
      success: false,
      errors: fieldErrors,
    }
  }

  try{
    await updateEventWithId(eventId, validatedFields.data);
  } catch(error){
    const message = error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return {
      message:`Database error: ${message}`,
      success: false,
    }
  }

  revalidatePath(`/admin/t/${eventId}`);
  return {message: "Changes saved.", success: true};
}