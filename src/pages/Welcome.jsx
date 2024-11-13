import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/routesModel";

export default function Welcome() {
  // Function to handle button click
  const navigate = useNavigate();
  const handleButtonClick = (answer) => {
    if (answer === "No") {
      alert(
        "To participate in this experiment, you must agree to the terms below."
      );
      return;
    }
    if (answer === "Yes") {
      navigate(ROUTES.EXPLANATION);
    }
  };

  return (
    <Container sx={{ padding: 10 }}>
      <Typography variant="h6" gutterBottom>
        Dear participant, you are about to complete a series of choices. There
        are no right or wrong answers, and what matters to us is that you answer
        honestly. The answers are anonymous, and the data collected will be used
        for academic research purposes only. The estimated time to complete all
        questions is about 5 minutes, and you may stop at any time. If you
        encounter any problems, you can contact the research team by email.
      </Typography>
      <Typography variant="h6" gutterBottom>
        be@ruppin.ac.il
      </Typography>
      <Typography variant="h6" gutterBottom>
        By clicking on the 'Continue' button, you confirm that:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="1. You agree to participate in the research as described above." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. The purpose of the research has been explained to you in general terms." />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. The expected duration of the research has been explained to you." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4. It has been explained to you that you may withdraw from the research at any time." />
        </ListItem>
        <ListItem>
          <ListItemText primary="5. It has been explained to you that the research is anonymous, and your personal details will not be stored." />
        </ListItem>
        <ListItem>
          <ListItemText primary="6. It has been explained to you that all the data collected will be used for academic research purposes only." />
        </ListItem>
        <ListItem>
          <ListItemText primary="7. It has been explained to you that if you have any questions related to the research, you can contact the research team for further consultation." />
        </ListItem>
        <ListItem>
          <ListItemText primary="8. You declare that you have given your consent voluntarily and that you understand all the above." />
        </ListItem>
      </List>
      <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick("Yes")}
          sx={{ marginX: 1 }}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleButtonClick("No")}
          sx={{ marginX: 1 }}
        >
          No
        </Button>
      </Box>
    </Container>
  );
}
