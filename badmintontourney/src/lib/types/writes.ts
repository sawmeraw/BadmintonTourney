import z from "zod";

export const tournamentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location_id: z.string().uuid().nullable(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
  shuttle_info: z.string().optional().nullable(),
  food_info: z.string().optional().nullable(),
  parking_info: z.string().optional().nullable(),
  misc_info: z.string().optional().nullable(),
  contact_info: z.string().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),
  is_registration_closed: z.boolean().default(false),
});

export type UpdateTournamentPayload = z.infer<typeof tournamentSchema>;