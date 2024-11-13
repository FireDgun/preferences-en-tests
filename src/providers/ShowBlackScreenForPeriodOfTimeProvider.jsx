import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { createContext } from "react";

const ShowBlackScreenForPeriodOfTimeContext = createContext();

export default function ShowBlackScreenForPeriodOfTimeProvider({ children }) {
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const showBlackScreenForPeriodOfTime = (time) => {
    setShowBlackScreen(true);
    setTimeout(() => {
      setShowBlackScreen(false);
    }, time);
  };
  return (
    <ShowBlackScreenForPeriodOfTimeContext.Provider
      value={showBlackScreenForPeriodOfTime}
    >
      {children}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          display: showBlackScreen ? "block" : "none",
        }}
      ></Box>
    </ShowBlackScreenForPeriodOfTimeContext.Provider>
  );
}

export const useShowBlackScreenForPeriodOfTime = () => {
  const context = useContext(ShowBlackScreenForPeriodOfTimeContext);
  if (context === undefined) {
    throw new Error(
      "useShowBlackScreenForPeriodOfTime must be used within a ShowBlackScreenForPeriodOfTimeProvider"
    );
  }
  return context;
};
