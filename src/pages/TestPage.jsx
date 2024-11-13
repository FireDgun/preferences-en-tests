import React, { useEffect } from "react";
import { useUser } from "../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/routesModel";
import TestStageOne from "./TestStageOne";
import TestStageTwo from "./TestStageTwo";
const isStageTwoOpen = true;

export default function TestPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.ROOT);
    }
    if (user?.stage === 3) {
      navigate(ROUTES.THANK_YOU);
    }
    if (user?.stage === 2 && !isStageTwoOpen) {
      navigate(ROUTES.TEST_STAGE_ONE_FINISH);
    }
  }, [user, navigate]);
  if (!user) {
    return null;
  }
  if (user.stage === 1) {
    return <TestStageOne />;
  } else return <TestStageTwo />;
}
