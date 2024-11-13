import React from "react";
import { Typography, Box } from "@mui/material";
import BackButton from "../../components/BackButton";

export default function FinishStageOne() {
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
        Thank you very much for your participation.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        The second stage of the experiment will be available in one week.
      </Typography>
      <BackButton />
    </Box>
  );
}
