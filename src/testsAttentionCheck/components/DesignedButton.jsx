import { Button } from "@mui/material";
import React, { useState } from "react";

export default function DesignedButton({ onClick, sx, children }) {
  const [isActive, setIsActive] = useState(false);
  const [isClickable, setIsClickable] = useState(true);

  const handleClick = () => {
    if (!isClickable) return; // Prevents further action if the button is not clickable

    setIsActive(true);
    setIsClickable(false); // Disables the button clickability

    setTimeout(() => {
      setIsActive(false); // Reset the border

      // Allow the button to be clickable again after some time
      setTimeout(() => {
        setIsClickable(true);
      }, 500);

      if (onClick) {
        onClick(); // Execute the provided onClick function
      }
    }, 500);
  };

  return (
    <Button
      sx={{
        ...sx,
        border: isActive ? "10px solid green" : "",
        transition: "border 250ms ease-in-out",
        pointerEvents: isClickable ? "auto" : "none", // Disable pointer events when not clickable
        opacity: isClickable ? 1 : 0.5, // Visual feedback for disabled state
      }}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
