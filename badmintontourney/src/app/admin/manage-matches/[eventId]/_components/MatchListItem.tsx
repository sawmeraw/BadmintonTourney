"use client";
import { Box, Typography, Stack, Button as MuiButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { type MatchSample } from "./types";

const getParticipantName = (participant: MatchSample["participant1"]) => {
  if (!participant?.player1) return "TBD";
  let name = participant.player1.name;
  if (participant.player2) name += ` / ${participant.player2.name}`;
  return name;
};

const formatScores = (sets: MatchSample["match_sets"]) => {
  if (!sets || sets.length === 0) return "-";
  return sets
    .map((set) => `${set.participant1_score}-${set.participant2_score}`)
    .join(" / ");
};

interface MatchListItemProps {
  match: MatchSample;
  onEditScore: (match: MatchSample) => void; // Callback to open modal
}

export const MatchListItem = ({ match, onEditScore }: MatchListItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
      }}
    >
      <Stack spacing={0.5} sx={{ flexGrow: 1, mr: 2 }}>
        <Typography
          variant="body1"
          fontWeight={
            match.winner_participant_id === match.participant1?.id
              ? "bold"
              : "normal"
          }
        >
          {getParticipantName(match.participant1)}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={
            match.winner_participant_id === match.participant2?.id
              ? "bold"
              : "normal"
          }
        >
          {getParticipantName(match.participant2)}
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          mr: 3,
          minWidth: "80px",
          textAlign: "right",
        }}
      >
        {formatScores(match.match_sets)}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mr: 3, textTransform: "capitalize", minWidth: "60px" }}
      >
        {match.status}
      </Typography>

      <MuiButton
        variant="outlined"
        size="small"
        startIcon={<Edit />}
        onClick={() => onEditScore(match)} // Trigger modal open
        disabled={match.status === "completed"} // Example disabled state
      >
        Score
      </MuiButton>
    </Box>
  );
};
