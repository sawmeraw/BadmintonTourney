'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTournament, updateTournamentWithId } from "../services/TournamentService";
import { tournamentSchema } from "../types/writes";

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    description?: string[];
    start_date?: string[];
    end_date?: string[];
    location_id?: string[];
    status?: string[];
    shuttle_info?: string[];
    food_info?: string[];
    parking_info?: string[];
    misc_info?: string[];
    contact_info?: string[];
    banner_url?: string[];
    is_registration_closed?: string[];
  };
};

export async function createTournamentAction(prevState: FormState, formData: FormData): Promise<FormState>{
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = tournamentSchema.safeParse(rawFormData);
  if(!validatedFields.success){
    const {fieldErrors} = validatedFields.error.flatten();
    console.log(fieldErrors);
    return {
      message: "Form submission failed. Please check any errors below.",
      success: false,
      errors: fieldErrors
    }
  }

  try{
    const id = createTournament(validatedFields.data);
    if(!id){
      return {
        message: "An unknown error occurred.",
        success: false,
      }
    }
    revalidatePath('/admin/tournaments');
    redirect(`/admin/t/${id}`);
  } catch(error){
    const message = error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return {
      message:`Database error: ${message}`,
      success: false,
    }
  }
}

export async function updateTournamentAction(tournamentId:string, prevState: FormState, formData: FormData) : Promise<FormState>{
  const validatedFields = tournamentSchema.safeParse(Object.fromEntries(formData.entries()));

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
    await updateTournamentWithId(tournamentId, validatedFields.data);
  } catch(error){
    const message = error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred";
    return {
      message:`Database error: ${message}`,
      success: false,
    }
  }

  revalidatePath(`/admin/t/${tournamentId}`);
  return {message: "Changes saved.", success: true};
}
