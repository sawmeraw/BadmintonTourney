"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import { Button } from "@mui/material";
import { type MatchSample } from "./types";

interface MatchScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchSample | null;
  onSave: (
    matchId: string,
    sets: { p1Score: number; p2Score: number }[],
  ) => void;
}

export const MatchScoreModal = ({
  isOpen,
  onClose,
  match,
  onSave,
}: MatchScoreModalProps) => {
  const [scores, setScores] = useState<{ p1Score: string; p2Score: string }[]>([
    { p1Score: "", p2Score: "" },
  ]);

  useEffect(() => {
    // Initialize scores when a match is selected
    if (match && match.match_sets.length > 0) {
      setScores(
        match.match_sets.map((s) => ({
          p1Score: String(s.participant1_score),
          p2Score: String(s.participant2_score),
        })),
      );
    } else {
      setScores([{ p1Score: "", p2Score: "" }]); // Default to one empty set
    }
  }, [match]);

  const handleScoreChange = (
    index: number,
    player: "p1" | "p2",
    value: string,
  ) => {
    const newScores = [...scores];
    newScores[index][player === "p1" ? "p1Score" : "p2Score"] = value.replace(
      /[^0-9]/g,
      "",
    ); // Allow only numbers
    setScores(newScores);
  };

  const addSet = () => {
    setScores([...scores, { p1Score: "", p2Score: "" }]);
  };

  const removeSet = (index: number) => {
    if (scores.length > 1) {
      setScores(scores.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!match) return;
    const finalSets = scores
      .filter((s) => s.p1Score !== "" || s.p2Score !== "") // Ignore empty sets
      .map((s) => ({
        p1Score: parseInt(s.p1Score || "0", 10),
        p2Score: parseInt(s.p2Score || "0", 10),
      }));
    onSave(match.id, finalSets);
  };

  const p1Name = match?.participant1?.player1.name || "Player 1";
  const p2Name = match?.participant2?.player1.name || "Player 2";

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Update Scores
        </Typography>
        {match && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {p1Name} vs {p2Name}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} mb={3}>
          {scores.map((set, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: "40px" }}>
                Set {index + 1}:
              </Typography>
              <TextField
                label={p1Name}
                size="small"
                type="number"
                value={set.p1Score}
                onChange={(e) => handleScoreChange(index, "p1", e.target.value)}
                inputProps={{ min: 0 }}
              />
              <TextField
                label={p2Name}
                size="small"
                type="number"
                value={set.p2Score}
                onChange={(e) => handleScoreChange(index, "p2", e.target.value)}
                inputProps={{ min: 0 }}
              />
              {scores.length > 1 && (
                <Button
                  variant="outlined"
                  onClick={() => removeSet(index)}
                  className="text-red-600"
                >
                  X
                </Button>
              )}
            </Stack>
          ))}
          <Button variant="contained" onClick={addSet}>
            + Add Set
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Scores</Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
