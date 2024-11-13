// StaticTest.js
import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import RankedProductsTable from "./RankedProductsTable";
import ShowProductsDraggable from "./ShowProductsDraggable";

const StaticTest = ({ couples, handleDone, title = "" }) => {
  const [products, setProducts] = useState(couples.flat());
  const [rankedProducts, setRankedProducts] = useState(
    Array(couples.flat().length).fill(null)
  );

  const handleDragStart = (e, product) => {
    e.dataTransfer.setData("product", JSON.stringify(product));
  };

  const handleDropRanked = (e, rank) => {
    e.preventDefault();
    let product = e.dataTransfer.getData("product");

    if (product === "") return;
    product = JSON.parse(product);
    const newRankedProducts = [...rankedProducts];
    if (newRankedProducts[rank]) return; // Avoid duplicates in ranks

    newRankedProducts[rank] = product; // Set product in the specified rank
    setRankedProducts(newRankedProducts);
    setProducts((prev) => prev.filter((p) => p !== product));
  };

  const handleRemoveRanked = (e, rank) => {
    e.preventDefault();
    const product = rankedProducts[rank];
    if (!Number.isInteger(product)) return;

    const newProducts = [...products, product];
    const newRankedProducts = [...rankedProducts];
    newRankedProducts[rank] = null;

    setProducts(newProducts);
    setRankedProducts(newRankedProducts);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" align="center">
        Rank the following products
      </Typography>
      <Typography variant="h6" align="center">
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          {products.length > 0 ? (
            <ShowProductsDraggable
              products={products}
              handleDragStart={handleDragStart}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 25,
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleDone(rankedProducts)}
              >
                Save
              </Button>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <RankedProductsTable
            rankedProducts={rankedProducts}
            handleDropRanked={handleDropRanked}
            handleRemoveRanked={handleRemoveRanked}
            allowDrop={allowDrop}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaticTest;
