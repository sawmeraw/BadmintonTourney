"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import {
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";

type Player = { id: string; first_name: string; last_name: string | null };

export const PlayerInput = ({
  playerNumber,
  allPlayers,
  value,
  onChange,
}: {
  playerNumber: number;
  allPlayers: Player[];
  value: any;
  onChange: (value: any) => void;
}) => {
  const [mode, setMode] = useState<"existing" | "new">("existing");

  const handleModeChange = (newMode: "existing" | "new") => {
    setMode(newMode);
    onChange(
      newMode === "existing"
        ? { mode: "existing", player_id: "" }
        : { mode: "new", first_name: "", last_name: "" }
    );
  };

  return (
    <div className="bg-white p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Player {playerNumber}
      </label>
      <div className="flex items-center gap-4 mb-3">
        <Button
          type="button"
          onClick={() => handleModeChange("existing")}
          variant={mode === "existing" ? "contained" : "text"}
          color={mode === "existing" ? "primary" : "secondary"}
        >
          Select Existing
        </Button>
        <Button
          type="button"
          onClick={() => handleModeChange("new")}
          variant={mode === "new" ? "contained" : "text"}
          color={mode === "new" ? "primary" : "secondary"}
        >
          Create New
        </Button>
      </div>

      <div
        className={`transition-all duration-800 overflow-hidden py-2 ${
          mode === "existing" ? "max-h-20" : "max-h-40"
        }`}
      >
        {mode === "existing" ? (
          <FormControl fullWidth required size="small">
            <InputLabel id="player-select-label">Player</InputLabel>
            <Select
              labelId="player-select-label"
              id="player_id"
              name="player_id"
              value={value?.player_id || ""}
              label="Player"
              onChange={(e) =>
                onChange({ mode: "existing", player_id: e.target.value })
              }
            >
              <MenuItem value="">Select a player...</MenuItem>
              {allPlayers.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <TextField
              required
              fullWidth
              size="small"
              label="First Name"
              value={value?.first_name || ""}
              onChange={(e) =>
                onChange({ ...value, mode: "new", first_name: e.target.value })
              }
            />
            <TextField
              required
              fullWidth
              size="small"
              label="Last Name"
              value={value?.last_name || ""}
              onChange={(e) =>
                onChange({ ...value, mode: "new", last_name: e.target.value })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
