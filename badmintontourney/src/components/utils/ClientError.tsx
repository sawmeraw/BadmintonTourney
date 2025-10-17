"use client";

import { Box, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

interface ErrorDisplayProps {
  message?: string;
}

export const ErrorDisplay = ({
  message = "We couldn't load the requested data.",
}: ErrorDisplayProps) => {
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
        bgcolor: grey[100],
        border: `1px solid ${grey[300]}`,
        minHeight: "400px", // Ensures the component has some vertical space
      }}
    >
      <ErrorOutline
        sx={{
          fontSize: 48,
          color: "error.main",
          mb: 2,
        }}
      />
      <Typography
        variant="h5"
        component="h3"
        fontWeight="semibold"
        color="text.primary"
      >
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Box>
  );
};
