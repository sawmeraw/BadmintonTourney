import z from "zod";

const statusOptions = z.union([
  z.literal("upcoming"),
  z.literal("ongoing"),
  z.literal("completed"),
  z.literal("cancelled"),
]);

export const tournamentSchema = z.object({
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
  is_registration_closed: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
});


export type UpdateTournamentPayload = z.infer<typeof tournamentSchema>;
export type CreateTournamentPayload = z.infer<typeof tournamentSchema>;

export const updateEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  event_type_id: z.uuid("Invalid event type selected."),
  description: z.string().optional().nullable(),
  entry_fee: z.coerce.number().min(0).nullable().optional(),
  first_prize_money: z.coerce.number().min(0).optional(),
  second_prize_money: z.coerce.number().min(0).optional(),
  third_prize_money: z.coerce.number().min(0).optional(),
  prize_details: z.string().optional().nullable(),
  sponsor_name: z.string().optional().nullable(),
  max_participants: z.coerce.number().min(0),
  notes: z.string().optional().nullable(),
  is_featured: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  has_third_place_match: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  finalised_for_matches: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  template_id: z.uuid("Invalid template selected").nullable().optional(),
})

export const createEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tournament_id: z.uuid("Invalid Tournament"),
  event_type_id: z.uuid("Invalid event type selected."),
  description: z.string().optional().nullable(),
  entry_fee: z.coerce.number().min(0).nullable().optional(),
  first_prize_money: z.coerce.number().min(0).optional(),
  second_prize_money: z.coerce.number().min(0).optional(),
  third_prize_money: z.coerce.number().min(0).optional(),
  prize_details: z.string().optional().nullable(),
  sponsor_name: z.string().optional().nullable(),
  max_participants: z.coerce.number().min(0),
  notes: z.string().optional().nullable(),
  is_featured: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  has_third_place_match: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  finalised_for_matches: z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]),
  template_id: z.uuid("Invalid template selected").nullable().optional(),
})

export type UpdateEventPayload = z.infer<typeof updateEventSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;