import { Box, Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import React from "react";

const PreventFromSmallScreenContext = createContext();

export default function PreventFromSmallScreenProvider({ children }) {
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenSize < 600) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, [screenSize]);
  return (
    <PreventFromSmallScreenContext.Provider value={{}}>
      {children}
      <Box
        sx={{
          display: isSmallScreen ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center">
            The experiment is not supported by small screens. We apologize for
            the inconvenience.
          </Typography>
        </Box>
      </Box>
    </PreventFromSmallScreenContext.Provider>
  );
}
