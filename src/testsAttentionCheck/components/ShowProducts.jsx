import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { OPTIONS, OPTIONS_NAME } from "../optionsModel";

export default function ShowProducts({
  products,
  handleChooseProduct,
  savePlace = true,
  width = 190,
  height = 190,
}) {
  const [removedIndices, setRemovedIndices] = useState(new Set()); // Tracks removed items

  const handleRemoveProduct = (effectiveIndex, product) => {
    if (savePlace) {
      setRemovedIndices(new Set(removedIndices.add(effectiveIndex))); // Add effective index to removed set
    }
    handleChooseProduct(product, OPTIONS_NAME[`OPTION${product}`]);
  };

  return (
    <Box>
      <Grid container spacing={2} justifyContent="center">
        {Array.from({ length: 10 }).map((_, index) => {
          const countRemovedBeforeIndex = Array.from(removedIndices).filter(
            (i) => i < index
          ).length;
          const effectiveIndex = index - countRemovedBeforeIndex;
          const product = products[effectiveIndex];

          return (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
              {removedIndices.has(index) ||
              effectiveIndex >= products.length ? (
                <div style={{ width: width, height: height }} /> // Empty space
              ) : (
                <Button
                  onClick={() => handleRemoveProduct(index, product)}
                  sx={{ marginX: 1 }}
                >
                  <img
                    src={OPTIONS[`OPTION${product}`]}
                    alt={`option${effectiveIndex + 1}`}
                    style={{ width: width, height: height }}
                  />
                </Button>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
