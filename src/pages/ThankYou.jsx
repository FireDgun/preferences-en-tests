import React from "react";
import { Typography, Box } from "@mui/material";

export default function ThankYou() {
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
        We truly appreciate the time and effort you have devoted to this task.
      </Typography>
    </Box>
  );
}
