import { Box, Typography } from "@mui/material";
import { HourglassEmpty } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

interface BracketNotGeneratedProps {
  message?: string;
}
export default function BracketNotGenerated({
  message = "Brackets for this round havent been generated yet.",
}: BracketNotGeneratedProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        m: 2,
        borderRadius: 2,
        bgcolor: grey[50],
        border: `1px solid ${grey[200]}`,
        minHeight: "200px",
        height: "100%",
      }}
    >
      <HourglassEmpty
        sx={{
          fontSize: 40,
          color: "text.secondary", // Use secondary text color
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary">
        Bracket Not Ready
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Box>
  );
}
