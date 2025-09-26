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