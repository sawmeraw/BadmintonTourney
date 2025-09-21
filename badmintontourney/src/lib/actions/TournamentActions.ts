'use server';
import { createClient } from "@/supabase/server";
import { tournamentSchema, UpdateTournamentPayload } from "../types/writes";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";

export type FormState = {
    success: boolean,
    message : string,
    errors?: Record<string, string[] | undefined>;
}

export async function createTournament(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const validatedFields = tournamentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const {fieldErrors, formErrors} = z.flattenError(validatedFields.error); 
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: {
        ...fieldErrors,
        _form: formErrors.length ? formErrors : undefined,
      },
    };
  }

  const { data, error } = await (await supabase)
    .from('tournaments')
    .insert(validatedFields.data)
    .select('id')
    .single();

  if (error) {
    return { success: false, message: `Database Error: ${error.message}` };
  }

  revalidatePath('/admin/t');
  redirect(`/admin/t/${data.id}`, RedirectType.push);
}

export async function updateTournament(
  tournamentId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  
  const validatedFields = tournamentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const {fieldErrors, formErrors} = z.flattenError(validatedFields.error); 
    return {
      success: false,
      message: "Validation failed.",
      errors: {
        ...fieldErrors,
        _form: formErrors.length ? formErrors : undefined
      },
    };
  }
  
  const { error } = await (await supabase)
    .from('tournaments')
    .update(validatedFields.data)
    .eq('id', tournamentId);
  
  if (error) {
    return { success: false, message: `Database Error: ${error.message}` };
  }
  
  revalidatePath(`/admin/t/${tournamentId}`);
  return { success: true, message: "Tournament updated successfully." };
}