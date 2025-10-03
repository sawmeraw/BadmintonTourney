import z from "zod";

const statusOptions = z.union([
  z.literal("upcoming"),
  z.literal("ongoing"),
  z.literal("completed"),
  z.literal("cancelled"),
]);

const participantStatusOptions = z.union([z.literal("active"), z.literal("withdrawn"), z.literal("disqualified")]);
const transformCheckboxtoBoolean = z.union([z.string().transform((data)=> data === "on"), z.literal(undefined).transform(()=> false)]);

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
  is_registration_closed: transformCheckboxtoBoolean,
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
  is_featured: transformCheckboxtoBoolean,
  has_third_place_match: transformCheckboxtoBoolean,
  finalised_for_matches: transformCheckboxtoBoolean,
  template_id: z.uuid("Invalid template selected").nullable().optional(),
});

export const updateFinalizedEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  entry_fee: z.coerce.number().min(0).nullable().optional(),
  first_prize_money: z.coerce.number().min(0).optional(),
  second_prize_money: z.coerce.number().min(0).optional(),
  third_prize_money: z.coerce.number().min(0).optional(),
  prize_details: z.string().optional().nullable(),
  sponsor_name: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

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
  is_featured: transformCheckboxtoBoolean,
  has_third_place_match: transformCheckboxtoBoolean,
  finalised_for_matches: transformCheckboxtoBoolean,
  template_id: z.uuid("Invalid template selected").nullable().optional(),
});

const existingPlayerSchema = z.object({
  mode: z.literal("existing"),
  player_id: z.string(),
})

const newPlayerSchema = z.object({
  mode: z.literal("new"),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  middle_name: z.string().nullable().optional()
})

const playerSchema = z.discriminatedUnion('mode', [
  existingPlayerSchema, newPlayerSchema
]);

export const createParticipantApiSchema = z.object({
  event_type: z.enum(["singles", "doubles"]),
  player1: playerSchema,
  player2: playerSchema.optional(),
  seed: z.number().int().nonnegative().optional(),
  autoSeed: z.boolean(),
  status: participantStatusOptions,
  event_id: z.string()
}).refine(data =>{
  if(data.event_type == "doubles"){
    return !! data.player2;
  }
  return true;
}, {
  message: "Doubles events require a second player",
  path: ["player2"],
});

export const createPlayerSchema = z.object({
  first_name: z.string("First name is required").min(1),
  last_name: z.string("Last name is required").min(1),
  middle_name: z.string().optional().nullable(),
  state: z.string().max(15).nullable().optional(),
  date_of_birth: z.string().refine(val=>{
    return !isNaN(Date.parse(val))
  }, {
    message: "Invalid date format",
  }).optional().nullable(),
  profile_image_url: z.string().nullable().optional()
});

export const updateParticipantsSchema = z.object({
  event_id: z.uuid(),
  updates: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['active', 'withdrawn', 'disqualified']).optional(),
      removeSeed: z.boolean().optional(),
      isDeleted: z.boolean().optional(),
    })
  ),
});

export const updateSeedSchema = z.object({
  event_id: z.uuid(),
  participant_id: z.uuid(),
  seed: z.number().int().positive()
})

export type UpdateEventPayload = z.infer<typeof updateEventSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type UpdateFinalizedEventPayload = z.infer<typeof updateFinalizedEventSchema>;
export type CreateParticipantApiPayload = z.infer<typeof createParticipantApiSchema>;
export type CreatePlayerPayload = z.infer<typeof createPlayerSchema>;
export type UpdateParticipantPayload = z.infer<typeof updateParticipantsSchema>;
export type UpdateSeedPayload = z.infer<typeof updateSeedSchema>;