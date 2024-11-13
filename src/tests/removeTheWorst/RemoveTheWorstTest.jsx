import React, { useEffect, useState } from "react";
import ShowProducts from "../components/ShowProducts";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routesModel";
import { setUserOnDb } from "../../auth/authService";
import { useUser } from "../../providers/UserProvider";
import { OPTIONS_NAME } from "../optionsModel";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";

export default function RemoveTheWorstTest({ couples }) {
  const [productsRank, setProductsRank] = useState([]);
  const [products, setProducts] = useState(couples.flat());
  const [timeTaken, setTimeTaken] = useState(null);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
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
    const choosePrize = (choices) => {
      let rnd = Math.floor(Math.random() * choices.length);
      return choices[rnd];
    };

    const handleDone = async () => {
      let timeTakenCalculation = (Date.now() - timeTaken) / 1000;
      let stage2Timestamp = Date.now();
      let prize = choosePrize(productsRank.toReversed());

      await setUserOnDb({
        ...user,
        preferencesStage2: productsRank.toReversed(),
        testNumber: 1,
        timeTaken: timeTakenCalculation,
        stage2Timestamp: stage2Timestamp,
        prize: prize,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2: productsRank.toReversed(),
        testNumber: 1,
        timeTaken: timeTakenCalculation,
        stage2Timestamp: stage2Timestamp,
        prize: prize,
      }));
      navigate(ROUTES.FEEDBACK);
    };
    if (products.length === 0) {
      handleDone();
    }
  }, [products, timeTaken, productsRank, navigate, setUser, user]);
  console.log(productsRank);
  console.log(user);

  return (
    <div>
      {productsRank.length > 0 && (
        <Typography variant="h4" align="center">
          Among the remaining products
        </Typography>
      )}
      <Typography variant="h4" align="center">
        Select your least preferred product
      </Typography>
      <ShowProducts
        products={products}
        handleChooseProduct={handleChooseProduct}
      />
    </div>
  );
}
