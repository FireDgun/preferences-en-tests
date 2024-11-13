import React from "react";
import { Typography, Box } from "@mui/material";
import BackButton from "../components/BackButton";

export default function ErrorPage() {
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
        Page not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Back to home page
      </Typography>
      <BackButton />
    </Box>
  );
}
