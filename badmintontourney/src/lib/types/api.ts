import { Participants, Players } from "@/supabase/queryTypes";

type PlayerSummary = Pick<
  Players,
  | "id"
  | "first_name"
  | "last_name"
  | "state"
  | "date_of_birth"
  | "profile_image_url"
  | "created_at"
  | "updated_at"
  | "middle_name"
>;

export type ParticipantListApiResponse = {
  totalCount: number;
  participants: Array<
    Pick<Participants, "id" | "seed" | "status"> & {
      player1: PlayerSummary;
      player2: PlayerSummary | null;
    }
  >;
};

