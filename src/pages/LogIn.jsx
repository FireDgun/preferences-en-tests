import React, { useState } from "react";
import { recreateTesterUser } from "../auth/authService";
import { Button, Container, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/routesModel";
import { useUser } from "../providers/UserProvider";
import adminUser from "../lib/adminUser";
const options = [
  { label: "Stage 1", stage: 1, group: 1 },
  { label: "Stage 2, Remove The Best Test", stage: 2, group: 1 },
  { label: "Stage 2, Remove The Worst Test", stage: 2, group: 2 },
  { label: "Stage 2, Bottom Up Test", stage: 2, group: 3 },
  { label: "Stage 2, Top Down Test", stage: 2, group: 4 },
  { label: "Stage 2, Iterative Categorization", stage: 2, group: 5 },
  { label: "Stage 2, Static Test", stage: 2, group: 6 },
  { label: "Stage 2, Pairwise Static Test", stage: 2, group: 7 },
];
const isStageOneOpen = true;

export default function LogIn() {
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleOptionChange = (event) => {
    const selectedIndex = event.target.value;
    const selectedOption = options[selectedIndex];
    setSelectedStage(selectedOption.stage);
    setSelectedGroup(selectedOption.group);
  };

  const handleLogin = async () => {
    const userFromDb = await recreateTesterUser(selectedGroup, selectedStage);
    setUser(userFromDb);

    if (userFromDb.id === adminUser.id) {
      navigate(ROUTES.ADMIN);
    } else if (userFromDb?.stage === 1 && !isStageOneOpen) {
      navigate(ROUTES.TEST_STAGE_ONE_CLOSED);
    } else if (userFromDb.stage === 1) {
      navigate(ROUTES.WELCOME);
    } else if (userFromDb.stage === 2) {
      navigate(ROUTES.TEST);
    } else {
      navigate(ROUTES.THANK_YOU);
    }
  };

  return (
    <Container
      sx={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Select
        value={
          selectedStage === ""
            ? ""
            : options.findIndex(
                (option) =>
                  option.stage === selectedStage &&
                  option.group === selectedGroup
              )
        }
        onChange={handleOptionChange}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>
          Select Stage and Group
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={index}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Button
        onClick={handleLogin}
        variant="contained"
        disabled={!selectedStage || !selectedGroup}
        size="large"
      >
        Start
      </Button>
    </Container>
  );
}
