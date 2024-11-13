import { Box, Button, Grid } from "@mui/material";
import React from "react";
import { OPTIONS } from "../optionsModel";

export default function ShowProductsDraggable({
  products,
  handleDragStart = () => {}, // This is expected to always be provided in this component
  width = 130,
  height = 130,
}) {
  console.log(products);

  return (
    <Box>
      <Grid container spacing={2} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
            <Button
              sx={{ marginX: 1 }}
              onDragStart={(e) => handleDragStart(e, product)}
              draggable={true} // Always draggable in this component
            >
              <img
                src={OPTIONS[`OPTION${product}`]}
                alt={`option${index + 1}`}
                style={{ width: width, height: height }}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
