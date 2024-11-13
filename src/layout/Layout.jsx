import React from "react";
import { Box } from "@mui/material";
export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e3f2fd",
      }}
    >
      {children}
    </Box>
  );
}
