import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/routesModel";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(ROUTES.ROOT)}
    >
      Back
    </Button>
  );
}
