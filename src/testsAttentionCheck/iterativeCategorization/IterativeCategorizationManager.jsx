import React, { useEffect, useState } from "react";
import IterativeCategorizationTest from "./IterativeCategorizationTest";
import { OPTIONS_NAME } from "../optionsModel";
import { setUserOnDb } from "../../auth/authService";
import { useUser } from "../../providers/UserProvider";

//categorizationLevel 0 - categorize products to 2 categories
//categorizationLevel 1 - categorize 1st time good products to 2 categories
//categorizationLevel 2 - categorize 1nd time bad products to 2 categories
//categorizationLevel 3 - categorize bad good products to 2 categories
//categorizationLevel 4 - categorize good good products to 2 categories
//categorizationLevel 5 - categorize bad bad products to 2 categories
//categorizationLevel 6 - categorize good bad products to 2 categories

export default function IterativeCategorizationManager({
  couples,
  handleFinish,
}) {
  const [productsRank, setProductsRank] = useState([]);
  const [productsFinalRank, setProductsFinalRank] = useState([]);

  const [productsToCategorize, setProductsToCategorize] = useState(
    couples.flat()
  );

  const [categotizationLevel, setCategotizationLevel] = useState(0);
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [prize, setPrize] = useState("");
  const { user, setUser } = useUser();

  const handleChooseProduct = (productNumber) => {
    if (productNumber === 1) {
      setProductsRank((prev) => [
        ...prev.slice(0, prev.length - 1),
        [product2],

        [product1],
      ]);
    }
    if (productNumber === 2) {
      setProductsRank((prev) => [
        ...prev.slice(0, prev.length - 1),
        [product1],

        [product2],
      ]);
    }
    setCategotizationLevel((prev) => prev + 1);
  };
  const handleProductNames = (products) => {
    let productsNames = [];
    products.forEach((product) => {
      productsNames.push(OPTIONS_NAME["OPTION" + product]);
    });
    return productsNames;
  };
  if (!timeTaken) {
    setTimeTaken(Date.now());
  }
  useEffect(() => {
    const handleDone = async () => {
      let productsNames = handleProductNames(productsFinalRank);
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
    const handleChooseCouples = () => {
      if (categotizationLevel >= 10) {
        if (productsRank.length === 0) {
          handleDone();
          return;
        }
        let bestProducts = productsRank[productsRank.length - 1];
        if (bestProducts.length === 2) {
          setProduct1(bestProducts[0]);
          setProduct2(bestProducts[1]);
        } else {
          setProductsRank((prevArray) => prevArray.slice(0, -1));
          setProductsFinalRank((prev) => [...prev, bestProducts[0]]);
          setCategotizationLevel((prev) => prev + 1);
        }
      }
    };
    handleChooseCouples();
  }, [
    categotizationLevel,
    productsRank,
    productsFinalRank,
    handleFinish,
    user,
    timeTaken,
    setUser,
    prize,
  ]);

  const choosePrize = (choices) => {
    let rnd = Math.floor((Math.random() - 0.01) * (choices.length + 5));
    if (rnd < 5) {
      return user.preferencesStage1[rnd].win;
    }

    return OPTIONS_NAME["OPTION" + choices[rnd - 5]];
  };

  const handleFinishCategorization = (goodProducts, notGoodProducts) => {
    switch (categotizationLevel) {
      case 0:
        setProductsRank([notGoodProducts, goodProducts]);
        setProductsToCategorize(goodProducts);
        setPrize(choosePrize(goodProducts));
        setCategotizationLevel(10);
        break;
      case 1:
        setProductsRank((prev) => [prev[0], notGoodProducts, goodProducts]);
        setProductsToCategorize(productsRank[0]);

        setCategotizationLevel(2);
        break;

      case 2:
        const copy = [...productsRank];
        setProductsRank((prev) => [
          notGoodProducts,
          goodProducts,
          prev[1],
          prev[2],
        ]);
        if (copy[1].length === 3) {
          setProductsToCategorize(copy[1]);

          setCategotizationLevel(3);
        } else if (copy[2].length === 3) {
          setProductsToCategorize(copy[2]);

          setCategotizationLevel(4);
        } else {
          setProductsToCategorize([]);

          setCategotizationLevel(10);
        }

        break;

      case 3:
        const copy2 = [...productsRank];
        setProductsRank((prev) => [
          prev[0],
          prev[1],
          notGoodProducts,
          goodProducts,
          prev[3],
        ]);
        if (copy2[0].length === 3) {
          setProductsToCategorize(copy2[0]);

          setCategotizationLevel(5);
        } else if (copy2[1].length === 3) {
          setProductsToCategorize(copy2[1]);

          setCategotizationLevel(6);
        } else {
          setProductsToCategorize([]);

          setCategotizationLevel(10);
        }

        break;
      case 4:
        const copy3 = [...productsRank];
        setProductsRank((prev) => [
          prev[0],
          prev[1],
          prev[2],
          notGoodProducts,
          goodProducts,
        ]);
        if (copy3[0].length === 3) {
          setProductsToCategorize(copy3[0]);

          setCategotizationLevel(5);
        } else if (copy3[1].length === 3) {
          setProductsToCategorize(copy3[1]);

          setCategotizationLevel(6);
        } else {
          setProductsToCategorize([]);

          setCategotizationLevel(10);
        }

        break;

      case 5:
        setProductsRank((prev) => [
          notGoodProducts,
          goodProducts,
          ...prev.slice(1),
        ]);
        setProductsToCategorize([]);

        setCategotizationLevel(10);
        break;

      case 6:
        setProductsRank((prev) => [
          prev[0],
          notGoodProducts,
          goodProducts,
          ...prev.slice(2),
        ]);
        setProductsToCategorize([]);

        setCategotizationLevel(10);
        break;
      default:
        return;
    }
  };

  return (
    <div>
      {product1 === null && product2 === null ? (
        <IterativeCategorizationTest
          title={
            "John always prefers more money to less money. Help John rank the following options."
          }
          productsToCategorize={productsToCategorize}
          categoryName1={"Less preferred products"}
          categoryName2={"More preferred prodcuts"}
          handleFinishCategorization={handleFinishCategorization}
        />
      ) : (
        <IterativeCategorizationTest
          title={
            "John always prefers more money to less money. Help John rank the following options. "
          }
          productsToCategorize={[product1, product2]}
          categoryName1={"Less preferred product"}
          categoryName2={"More preferred prodcut"}
          handleFinishCategorization={(goodProducts, notGoodProducts) => {
            handleChooseProduct(goodProducts[0] === product1 ? 1 : 2);
          }}
        />
      )}
    </div>
  );
}
