import React from "react";
import { Typography, Box } from "@mui/material";
import BackButton from "../components/BackButton";

export default function StageOneClosed() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh", // Full viewport height
        color: "text.primary",
        p: 3, // Padding
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        The experiment is currently closed to new participants.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        If you have already done step 1 - you should note that you typed the ID
        without errors
      </Typography>
      <BackButton />
    </Box>
  );
}
