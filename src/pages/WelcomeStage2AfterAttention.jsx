import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";

export default function WelcomeStage2AfterAttention({ handleButtonClick }) {
  return (
    <Container sx={{ padding: 10 }}>
      <Typography variant="h6" gutterBottom>
        "Explanation after Preliminary stage"
      </Typography>

      <Box mt={30} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          sx={{ marginX: 1 }}
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
}
