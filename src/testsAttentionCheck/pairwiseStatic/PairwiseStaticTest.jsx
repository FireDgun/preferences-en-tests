import React, { useEffect, useState } from "react";
import { useUser } from "../../providers/UserProvider";
import { OPTIONS, OPTIONS_NAME } from "../optionsModel";
import { setUserOnDb } from "../../auth/authService";
import { Box, Typography } from "@mui/material";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";
import DesignedButton from "../components/DesignedButton";
function shuffleInnerPairs(array) {
  // Map each pair to a new pair, possibly swapping the elements
  return array.map((pair) => {
    // Randomly decide whether to swap the elements
    if (Math.random() > 0.5) {
      return [pair[1], pair[0]]; // Return a new array with swapped elements
    } else {
      return [...pair]; // Return a copy of the original pair
    }
  });
}

export default function PairwiseStaticTest({ couples, handleFinish }) {
  const [allPossibleCouples, setAllPossibleCouples] = useState(null);
  const [choise, setChoise] = useState([]);
  const [coupleIndex, setCoupleIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [startTimeChoise, setStartTimeChoise] = useState(Date.now());

  const showBlackScreenForPeriodOfTime = useShowBlackScreenForPeriodOfTime();

  const { user, setUser } = useUser();
  useEffect(() => {
    const products = couples.flat();
    let allCouples = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        allCouples.push([products[i], products[j]]);
      }
    }
    // Shuffle the couples array
    allCouples = shuffleArray(allCouples);
    setAllPossibleCouples(allCouples);
  }, [couples]);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    const veryShuffledArray = shuffleInnerPairs(shuffledArray);
    return veryShuffledArray;
  };

  const handleChooseProduct = async (productIndex) => {
    showBlackScreenForPeriodOfTime(500);
    if (coupleIndex < allPossibleCouples.length) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTimeChoise) / 1000; // Time taken in milliseconds

      setChoise((prev) => [
        ...prev,
        {
          win: OPTIONS_NAME[
            "OPTION" + allPossibleCouples[coupleIndex][productIndex]
          ],
          lose: OPTIONS_NAME[
            "OPTION" + allPossibleCouples[coupleIndex][1 - productIndex]
          ],
          timeTaken: timeTaken,
        },
      ]);
      setStartTimeChoise(Date.now());
      setCoupleIndex((prev) => prev + 1);
    } else {
      console.log("done");
    }
  };

  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const handleDone = async () => {
      let timeTakenCalculation = (Date.now() - startTime) / 1000;

      await setUserOnDb({
        ...user,
        preferencesStage2Attention: choise,
        timeTakenAttention: timeTakenCalculation,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2Attention: choise,
        timeTakenAttention: timeTakenCalculation,
      }));
      handleFinish();
    };

    if (coupleIndex >= allPossibleCouples?.length) {
      handleDone();
    }
  }, [
    coupleIndex,
    startTime,
    choise,
    handleFinish,
    setUser,
    user,
    allPossibleCouples,
  ]);

  return (
    <Box padding={10}>
      <Typography variant="h4" align="center">
        John always prefers more money to less money.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        Select the option John would prefer.
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", padding: 10 }}>
        Choice {coupleIndex + 1} of {allPossibleCouples?.length}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {allPossibleCouples && coupleIndex < allPossibleCouples.length && (
          <Box key={coupleIndex}>
            <DesignedButton
              onClick={() => handleChooseProduct(0)}
              sx={{ marginX: 1 }}
            >
              <img
                src={OPTIONS["OPTION" + allPossibleCouples[coupleIndex][0]]}
                alt="option1"
                style={{ width: 250, height: 250 }}
              />
            </DesignedButton>
            <DesignedButton
              onClick={() => handleChooseProduct(1)}
              sx={{ marginX: 1 }}
            >
              <img
                src={OPTIONS["OPTION" + allPossibleCouples[coupleIndex][1]]}
                alt="option2"
                style={{ width: 250, height: 250 }}
              />
            </DesignedButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
