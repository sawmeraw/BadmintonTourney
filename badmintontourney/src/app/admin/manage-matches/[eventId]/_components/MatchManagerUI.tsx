"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import { MatchListItem } from "./MatchListItem";
import { MatchScoreModal } from "./MatchScoreModal";
import { sampleMatchData } from "./types";
import { type EventMatchesSampleData, type MatchSample } from "./types";

interface MatchManagerUIProps {
  id?: string;
}

export const MatchManagerUI = ({}: MatchManagerUIProps) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchSample | null>(null);
  const data = sampleMatchData;
  const handleEditScore = (match: MatchSample) => {
    setSelectedMatch(match);
  };

  const handleCloseModal = () => {
    setSelectedMatch(null);
  };

  const handleSaveScores = (
    matchId: string,
    sets: { p1Score: number; p2Score: number }[],
  ) => {
    //todo mutation shit here
    console.log("Saving scores for match:", matchId, sets);
    handleCloseModal();
  };

  return (
    <>
      <Stack spacing={4}>
        {data.rounds.map((round) => (
          <Card key={round.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ bgcolor: "grey.50" }}>
              <Typography variant="h5" fontWeight="medium">
                {round.name} (Round {round.sequence})
              </Typography>
            </CardContent>
            <Divider />
            <Box>
              {round.round_groups.map((group) => (
                <Box
                  key={group.id}
                  sx={{
                    p: { xs: 1, sm: 2 },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    color="primary.main"
                    gutterBottom
                  >
                    {group.name}
                  </Typography>
                  {group.matches.length > 0 ? (
                    <Stack spacing={2} divider={<Divider flexItem />}>
                      {group.matches.map((match) => (
                        <MatchListItem
                          key={match.id}
                          match={match}
                          onEditScore={handleEditScore}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 1 }}
                    >
                      No matches in this group yet.
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Card>
        ))}
      </Stack>

      <MatchScoreModal
        isOpen={!!selectedMatch}
        onClose={handleCloseModal}
        match={selectedMatch}
        onSave={handleSaveScores}
      />
    </>
  );
};
