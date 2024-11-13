import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { OPTIONS } from "../optionsModel";

export default function IterativeCategorizationTest({
  title = "",
  productsToCategorize,
  categoryName1,
  categoryName2,
  handleFinishCategorization,
}) {
  const [products, setProducts] = useState(productsToCategorize);
  const [goodProducts, setGoodProducts] = useState([]);
  const [notGoodProducts, setNotGoodProducts] = useState([]);

  useEffect(() => {
    setProducts(productsToCategorize);
    setGoodProducts([]);
    setNotGoodProducts([]);
  }, [productsToCategorize]);

  const handleDragStart = (e, product) => {
    e.dataTransfer.setData("product", product);
  };
  // Step 1: Calculate the maximum allowable products (half of total, rounded up)
  const maxProductsAllowed = Math.ceil(products.length / 2);

  const handleDropGood = (e) => {
    e.preventDefault();
    const product = e.dataTransfer.getData("product");

    if (goodProducts.includes(product) || product === "") {
      return;
    }
    // Only proceed if adding a product does not exceed the limit
    if (goodProducts.length < maxProductsAllowed) {
      if (notGoodProducts.includes(product)) {
        setNotGoodProducts((prev) => prev.filter((item) => item !== product));
      }
      setGoodProducts((prev) => [...prev, product]);
    } else {
      // Step 3: Show a message if the limit is exceeded
      alert(
        "You have added the maximum number of items to the group. Please remove one item, or add it to the other group. Please try again."
      );
    }
  };

  const handleDropNotGood = (e) => {
    e.preventDefault();
    const product = e.dataTransfer.getData("product");
    if (notGoodProducts.includes(product) || product === "") {
      return;
    }
    // Only proceed if adding a product does not exceed the limit
    if (notGoodProducts.length < maxProductsAllowed) {
      if (goodProducts.includes(product)) {
        setGoodProducts((prev) => prev.filter((item) => item !== product));
      }
      setNotGoodProducts((prev) => [...prev, product]);
    } else {
      // Step 3: Show a message if the limit is exceeded
      alert(
        "You have added the maximum number of items to the group. Please remove one item, or add it to the other group. Please try again."
      );
    }
  };

  const handleDropOut = (e) => {
    e.preventDefault();
    const product = e.dataTransfer.getData("product");
    if (product === "") return;
    if (goodProducts.includes(product)) {
      setGoodProducts((prev) => prev.filter((p) => p !== product));
    } else if (notGoodProducts.includes(product)) {
      setNotGoodProducts((prev) => prev.filter((p) => p !== product));
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Divide the products into two groups of{" "}
        {productsToCategorize.length % 2 === 0
          ? maxProductsAllowed
          : `${maxProductsAllowed}-${maxProductsAllowed - 1}`}{" "}
        products
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2} justifyContent="center" marginBottom={4}>
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" textAlign={"center"}>
            {categoryName1}
          </Typography>
          <Box
            onDragOver={allowDrop}
            onDrop={handleDropNotGood}
            sx={{
              border: "2px dashed",
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {notGoodProducts.map((product, index) => (
              <Button sx={{ marginX: 1 }} key={index}>
                <img
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, product)}
                  src={OPTIONS[`OPTION${product}`]}
                  alt={`option${index + 1}`}
                  style={{ width: 125, height: 125 }}
                />
              </Button>
            ))}
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={5}>
          <Grid container>
            <Box
              onDragOver={allowDrop}
              onDrop={handleDropOut}
              sx={{
                minHeight: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {products.map((product, index) =>
                notGoodProducts.includes("" + product) ||
                goodProducts.includes("" + product) ? null : (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Button sx={{ marginX: 1 }}>
                      <img
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, product)}
                        src={OPTIONS[`OPTION${product}`]}
                        alt={`option${index + 1}`}
                        style={{ width: 125, height: 125 }}
                      />
                    </Button>
                  </Grid>
                )
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" textAlign={"center"}>
            {categoryName2}
          </Typography>
          <Box
            onDragOver={allowDrop}
            onDrop={handleDropGood}
            sx={{
              border: "2px dashed",
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {goodProducts.map((product, index) => (
              <Button sx={{ marginX: 1 }} key={index}>
                <img
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, product)}
                  src={OPTIONS[`OPTION${product}`]}
                  alt={`option${index + 1}`}
                  style={{ width: 125, height: 125 }}
                />
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={10}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontSize: 24 }}
          disabled={
            products.length !== goodProducts.length + notGoodProducts.length
          }
          onClick={() => {
            handleFinishCategorization(goodProducts, notGoodProducts);
          }}
        >
          I have completed this step.
        </Button>
      </Box>
    </div>
  );
}
