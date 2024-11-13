import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";

export default function WelcomeStage2({ handleButtonClick }) {
  return (
    <Container sx={{ padding: 10 }}>
      <Typography variant="h6" gutterBottom>
        Hello again, this is the second part of the experiment you began one
        week ago. In this part, you will also be asked to choose between
        different products. We remind you that there are no right or wrong
        answers, and it is important that you answer candidly. Before we begin
        the experiment, in the next two screens, please follow the on-screen
        instructions.
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
