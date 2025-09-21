import { EventRound, Match, MatchSet, Participant, Player, RoundGroup, RoundType } from "@/supabase/queryTypes";

type PlayerSummary = Pick<
  Player,
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
    Pick<Participant, "id" | "seed" | "status"> & {
      player1: PlayerSummary;
      player2: PlayerSummary | null;
    }
  >;
};

export type PlayerBase = Pick<Player, "id" | "first_name" | "last_name">;
export type PlayerWithImage = PlayerBase & Pick<Player, "profile_image_url">;
export type PlayerListApiResponse = Array<PlayerWithImage>;

export type MatchResponseParticipantProperty = Pick<Participant, "id"> & {
    player1: PlayerBase;
    player2: PlayerBase | null;
};

export type MatchSummary = Pick<Match, "id" | "status" | "round_match_number" | "winner_id" | "winner_feeds_into_match_id" | "loser_feeds_into_match_id" | "start_time" | "court_number">;

export type EventRoundDetailsApiResponse = Pick<EventRound, "id" |"name" | "sequence"> & {
    round_type : Pick<RoundType, "id" | "name" | "created_at" | "updated_at" | "description">
    groups: Array<Pick<RoundGroup, "id" | "name"> & {
        participants: Array<Pick<Participant, "id"> & {
            player1: PlayerBase;
            player2: PlayerBase | null;
        }>
    }>;
    matches: Array<MatchSummary & {
        participant1: MatchResponseParticipantProperty;
        participant2: MatchResponseParticipantProperty | null;
        sets: Array<Pick<MatchSet, "set_number" | "participant1_score" | "participant2_score">>
    }>
}

