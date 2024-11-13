import React, { useEffect, useState } from "react";
import ShowProducts from "../components/ShowProducts";
import { Typography } from "@mui/material";
import { setUserOnDb } from "../../auth/authService";
import { useUser } from "../../providers/UserProvider";
import { OPTIONS_NAME } from "../optionsModel";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";

export default function RemoveTheBestTest({ couples, handleFinish }) {
  const [productsRank, setProductsRank] = useState([]);
  const [products, setProducts] = useState(couples.flat());
  const [timeTaken, setTimeTaken] = useState(null);
  const { user, setUser } = useUser();
  const showBlackScreenForPeriodOfTime = useShowBlackScreenForPeriodOfTime();

  const handleChooseProduct = (productNumber, productName) => {
    showBlackScreenForPeriodOfTime(500);
    if (products.length === 2) {
      let theOtherProduct = products.find(
        (product) => product !== productNumber
      );
      setProductsRank([
        ...productsRank,
        productName,
        OPTIONS_NAME[`OPTION${theOtherProduct}`],
      ]);
      setProducts([]);
      return;
    }
    setProductsRank([...productsRank, productName]);
    setProducts((prev) => prev.filter((product) => product !== productNumber));
  };

  useEffect(() => {
    if (!timeTaken) {
      setTimeTaken(Date.now());
    }

    const handleDone = async () => {
      let timeTakenCalculation = (Date.now() - timeTaken) / 1000;

      await setUserOnDb({
        ...user,
        preferencesStage2Attention: productsRank,
        timeTakenAttention: timeTakenCalculation,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2Attention: productsRank,
        timeTakenAttention: timeTakenCalculation,
      }));
      handleFinish();
    };
    if (products.length === 0) {
      handleDone();
    }
  }, [products, timeTaken, productsRank, setUser, user, handleFinish]);

  return (
    <div>
      <Typography variant="h4" align="center">
        John always prefers more money to less money.
      </Typography>
      {productsRank.length > 0 && (
        <Typography variant="h4" align="center">
          Among the remaining alternatives,
        </Typography>
      )}
      <Typography variant="h4" align="center">
        which one will John choose?
      </Typography>
      <ShowProducts
        products={products}
        handleChooseProduct={handleChooseProduct}
      />
    </div>
  );
}
