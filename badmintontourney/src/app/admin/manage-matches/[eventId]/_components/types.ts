export interface PlayerSample {
  id: string;
  name: string;
}

export interface ParticipantSample {
  id: string;
  player1: PlayerSample;
  player2?: PlayerSample;
}

export interface MatchSetSample {
  set_number: number;
  participant1_score: number;
  participant2_score: number;
}

export interface MatchSample {
  id: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  round_match_number: number | null;
  winner_participant_id: string | null;
  participant1: ParticipantSample | null;
  participant2: ParticipantSample | null;
  match_sets: MatchSetSample[];
}

export interface GroupSample {
  id: string;
  name: string;
  matches: MatchSample[];
}

export interface RoundSample {
  id: string;
  name: string;
  sequence: number;
  round_groups: GroupSample[];
}

export interface EventMatchesSampleData {
  eventName: string;
  rounds: RoundSample[];
}

export const sampleMatchData: EventMatchesSampleData = {
  eventName: "Demo Singles Event",
  rounds: [
    {
      id: "round1",
      name: "Semi-Finals",
      sequence: 1,
      round_groups: [
        {
          id: "group1A",
          name: "Main Bracket",
          matches: [
            {
              id: "match1",
              status: "completed",
              round_match_number: 1,
              winner_participant_id: "p1",
              participant1: {
                id: "p1",
                player1: { id: "playerA", name: "Alice" },
              },
              participant2: {
                id: "p4",
                player1: { id: "playerD", name: "David" },
              },
              match_sets: [
                {
                  set_number: 1,
                  participant1_score: 21,
                  participant2_score: 18,
                },
                {
                  set_number: 2,
                  participant1_score: 22,
                  participant2_score: 20,
                },
              ],
            },
            {
              id: "match2",
              status: "scheduled",
              round_match_number: 2,
              winner_participant_id: null,
              participant1: {
                id: "p2",
                player1: { id: "playerB", name: "Bob" },
              },
              participant2: {
                id: "p3",
                player1: { id: "playerC", name: "Charlie" },
              },
              match_sets: [],
            },
          ],
        },
      ],
    },
    {
      id: "round2",
      name: "Finals",
      sequence: 2,
      round_groups: [
        {
          id: "group2A",
          name: "Championship Match",
          matches: [
            {
              id: "match3",
              status: "scheduled",
              round_match_number: 1,
              winner_participant_id: null,
              participant1: null, // Winner of match 1 will go here
              participant2: null, // Winner of match 2 will go here
              match_sets: [],
            },
          ],
        },
      ],
    },
  ],
};
