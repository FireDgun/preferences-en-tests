import React, { useEffect, useState } from "react";
import ShowProducts from "../components/ShowProducts";
import { Typography } from "@mui/material";

import { setUserOnDb } from "../../auth/authService";
import { useUser } from "../../providers/UserProvider";
import { OPTIONS_NAME } from "../optionsModel";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";

export default function RemoveTheWorstTest({ couples, handleFinish }) {
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
        preferencesStage2Attention: productsRank.toReversed(),
        timeTakenAttention: timeTakenCalculation,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2Attention: productsRank.toReversed(),
        timeTakenAttention: timeTakenCalculation,
      }));
      handleFinish();
    };
    if (products.length === 0) {
      handleDone();
    }
  }, [products, timeTaken, productsRank, handleFinish, setUser, user]);
  console.log(productsRank);
  console.log(user);

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
        select the option John least prefers.
      </Typography>
      <ShowProducts
        products={products}
        handleChooseProduct={handleChooseProduct}
      />
    </div>
  );
}
