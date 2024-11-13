import React, { useCallback, useState } from "react";
import { setUserOnDb } from "../auth/authService";
import { useUser } from "../providers/UserProvider";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [adhd, setAdhd] = useState("");
  const [attention, setAttention] = useState("");
  const { user, setUser } = useUser();

  const handleDone = useCallback(async () => {
    await setUserOnDb({
      ...user,
      feedback,
      age,
      gender,
      adhd,
      attentionDifficulties: attention,
      stage: 3,
    });
    setUser((prev) => ({
      ...prev,
      feedback,
      age,
      gender,
      adhd,
      attentionDifficulties: attention,
      stage: 3,
    }));
    window.location.href =
      "https://app.prolific.com/submissions/complete?cc=CVM03WLM";
  }, [feedback, attention, age, gender, adhd, setUser, user]);

  return (
    <Container maxWidth="xs" style={{ padding: "10px" }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap={1}
        pt={3}
      >
        <TextField
          label="Age*"
          type="number"
          variant="outlined"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          required
          size="small"
          helperText="Please enter a valid age (1-120)."
        />

        <FormControl fullWidth required size="small">
          <Typography variant="body2" gutterBottom>
            Gender*
          </Typography>
          <Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="prefer not to say">Prefer not to say</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth required size="small">
          <Typography variant="body2" gutterBottom>
            Have you ever been diagnosed with Attention Deficit Hyperactivity
            Disorder (ADHD)?*
          </Typography>
          <Select value={adhd} onChange={(e) => setAdhd(e.target.value)}>
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="prefer not to say">Prefer not to say</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth required size="small">
          <Typography variant="body2" gutterBottom>
            To what extent do you experience difficulties with attention and
            focus in your daily activities?*
          </Typography>
          <Select
            value={attention}
            onChange={(e) => setAttention(e.target.value)}
          >
            <MenuItem value="">Select Difficulty</MenuItem>
            {[...Array(7).keys()].map((i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1} -{" "}
                {i === 0 ? "Not at all" : i === 6 ? "To a great extent" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Comments and Feedback (Optional)"
          multiline
          rows={3}
          variant="outlined"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          size="small"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleDone}
          size="small"
          disabled={
            !["male", "female", "prefer not to say"].includes(gender) ||
            age <= 0 ||
            age > 120 ||
            adhd === "" ||
            attention === ""
          }
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}
