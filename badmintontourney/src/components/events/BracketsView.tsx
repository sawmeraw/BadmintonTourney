import type { EventRoundDetailsApiResponse, MatchResponseParticipantProperty, MatchSummary } from '@/lib/types/api';
import { MatchSet } from '@/supabase/queryTypes';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { MatchCard } from './MatchCard';
import {
  Typography,
  Box,
  Grid,
} from '@mui/material';

export type MatchCardPropType = MatchSummary & {
    participant1 : MatchResponseParticipantProperty;
    participant2 : MatchResponseParticipantProperty | null;
    sets :Array<
      Pick<MatchSet, "set_number" | "participant1_score" | "participant2_score">
    >;
}

export const BracketView = ({ data }: { data: EventRoundDetailsApiResponse }) => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {data.name} Bracket
      </Typography>

      {data.matches.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Matches for this round have not been generated yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {data.matches
            .sort((a, b) => (a.round_match_number || 0) - (b.round_match_number || 0))
            .map((match) => (

              <Grid key={match.id} fontSize={{xs:12, sm:6, lg:4}}>
                <MatchCard match={match} />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};