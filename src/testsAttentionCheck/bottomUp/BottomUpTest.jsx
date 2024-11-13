import React, { useEffect, useState } from "react";
import { useUser } from "../../providers/UserProvider";
import { Box, Typography } from "@mui/material";
import { OPTIONS, OPTIONS_NAME } from "../optionsModel";
import { setUserOnDb } from "../../auth/authService";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";
import DesignedButton from "../components/DesignedButton";

export default function BottomUpTest({ couples, handleFinish }) {
  const [productsRank, setProductsRank] = useState([couples[0][0]]);
  const products = couples.flat();
  const [newProduct, setNewProduct] = useState(couples[0][1]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [indexToCompare, setIndexToCompare] = useState(0);
  const [choiseCount, setChoiseCount] = useState(0);
  const [choise, setChoise] = useState([]);
  const [choiseTimeTaken, setChoiseTimeTaken] = useState(Date.now());
  const { user, setUser } = useUser();
  const showBlackScreenForPeriodOfTime = useShowBlackScreenForPeriodOfTime();

  const handleChooseProduct = (productIndex) => {
    showBlackScreenForPeriodOfTime(500);
    setChoiseCount((prev) => prev + 1);

    if (productIndex === 0) {
      setProductsRank((prev) => [
        ...prev.slice(0, indexToCompare + 1), // Includes the item at indexToCompare
        newProduct, // Inserts newProduct after indexToCompare
        ...prev.slice(indexToCompare + 1), // Rest of the array after indexToCompare
      ]);
      setChoise((prev) => [
        ...prev,
        {
          win: OPTIONS_NAME["OPTION" + productsRank[indexToCompare]],
          lose: OPTIONS_NAME["OPTION" + newProduct],
          timeTaken: (Date.now() - choiseTimeTaken) / 1000,
        },
      ]);
      setIndexToCompare(productsRank.length);
      setNewProduct(products[productsRank.length + 1]);
    } else {
      setChoise((prev) => [
        ...prev,
        {
          lose: OPTIONS_NAME["OPTION" + productsRank[indexToCompare]],
          win: OPTIONS_NAME["OPTION" + newProduct],
          timeTaken: (Date.now() - choiseTimeTaken) / 1000,
        },
      ]);
      if (indexToCompare === 0) {
        setProductsRank([newProduct, ...productsRank]);
        setIndexToCompare(productsRank.length);
        setNewProduct(products[productsRank.length + 1]);
      } else {
        setIndexToCompare((prev) => prev - 1);
      }
    }
    setChoiseTimeTaken(Date.now());
  };

  const handleProductNames = (products) => {
    let productsNames = [];
    products.forEach((product) => {
      productsNames.push(OPTIONS_NAME["OPTION" + product]);
    });
    return productsNames;
  };

  useEffect(() => {
    if (!timeTaken) {
      setTimeTaken(Date.now());
    }
    const handleDone = async () => {
      let productsNames = handleProductNames(productsRank);
      let timeTakenCalculation = (Date.now() - timeTaken) / 1000;
      await setUserOnDb({
        ...user,
        preferencesStage2Attention: productsNames,
        timeTakenAttention: timeTakenCalculation,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2Attention: productsNames,
        timeTakenAttention: timeTakenCalculation,
      }));
      handleFinish();
    };
    if (productsRank.length === 2) {
      handleDone();
    }
  }, [
    productsRank,
    timeTaken,
    user,
    setUser,
    handleFinish,
    choiseCount,
    choise,
  ]);

  if (OPTIONS["OPTION" + newProduct] === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Box padding={10}>
      <Typography variant="h4" align="center">
        John always prefers more money to less money.
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", padding: 10 }}
      >
        Select the option John would prefer.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box>
          <DesignedButton
            onClick={() => handleChooseProduct(0)}
            sx={{ marginX: 1 }}
          >
            <img
              src={OPTIONS["OPTION" + productsRank[indexToCompare]]}
              alt="option1"
              style={{ width: 250, height: 250 }}
            />
          </DesignedButton>
          <DesignedButton
            onClick={() => handleChooseProduct(1)}
            sx={{ marginX: 1 }}
          >
            <img
              src={OPTIONS["OPTION" + newProduct]}
              alt="option2"
              style={{ width: 250, height: 250 }}
            />
          </DesignedButton>
        </Box>
      </Box>
    </Box>
  );
}
