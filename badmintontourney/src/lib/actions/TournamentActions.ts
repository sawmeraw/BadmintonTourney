'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const statusOptions = z.union([
  z.literal("upcoming"),
  z.literal("ongoing"),
  z.literal("completed"),
  z.literal("cancelled"),
]);

const tournamentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid start date format",
  }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid end date format",
  }),
  location_id: z.uuid("Invalid location ID").nullable(),
  status: statusOptions,
  shuttle_info: z.string().optional().nullable(),
  food_info: z.string().optional().nullable(),
  parking_info: z.string().optional().nullable(),
  misc_info: z.string().optional().nullable(),
  contact_info: z.string().optional().nullable(),
  banner_url: z.string().refine(val => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid banner URL",
  }).optional().nullable(),
  is_registration_closed: z.boolean().default(false),
});


export type UpdateTournamentPayload = z.infer<typeof tournamentSchema>;

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

export async function createTournament(prevState: FormState, formData: FormData): Promise<FormState>{
  console.log(Object.fromEntries(formData), {depth: null});
  const supabase = createClient();
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

  const {data, error} = await (await supabase)
    .from('tournaments')
    .insert(validatedFields.data)
    .select('id')
    .single();

  if(error){
    return {message: `Database Error: ${error.message}`, success: false};
  }

  revalidatePath('/admin/tournaments');
  redirect(`/admin/t/${data.id}`);
}

export async function updateTournament(tournamentId:string, prevState: FormState, formData: FormData) : Promise<FormState>{
  const supabase = createClient();
  const validatedFields = tournamentSchema.safeParse(Object.fromEntries(formData.entries()));

  if(!validatedFields.success){
    const {fieldErrors} = validatedFields.error.flatten();
    console.log(fieldErrors);
    return {
      message: "Submission failed. Please check errors below.",
      success: false,
      errors: fieldErrors,
    }
  }

  const {error} = await (await supabase)
    .from('tournaments')
    .update(validatedFields.data)
    .eq('id', tournamentId);
  
  if(error){
    return {
      message: `Database error: ${error.message}`,
      success: false
    }
  }

  revalidatePath(`/admin/t/${tournamentId}`);
  return {message: "Changes saved.", success: true};
}
