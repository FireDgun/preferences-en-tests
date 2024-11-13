import React, { useEffect, useState } from "react";
import { useUser } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { OPTIONS, OPTIONS_NAME } from "../optionsModel";
import { setUserOnDb } from "../../auth/authService";
import ROUTES from "../../routes/routesModel";
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
function multiplyMatrices(matrixA, matrixB) {
  // Check if multiplication is possible
  if (matrixA[0].length !== matrixB.length) {
    throw new Error("Matrix dimensions do not allow multiplication.");
  }

  // Initialize the result matrix with zeros
  let resultMatrix = new Array(matrixA.length)
    .fill(null)
    .map(() => new Array(matrixB[0].length).fill(0));

  // Multiply matrices
  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixB[0].length; j++) {
      for (let k = 0; k < matrixA[0].length; k++) {
        resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  return resultMatrix;
}

function sumMatrices(...matrices) {
  // Check if there are matrices to sum
  if (matrices.length === 0) {
    throw new Error("No matrices provided for summation.");
  }

  // Check for consistent dimensions across matrices
  const numRows = matrices[0].length;
  const numCols = matrices[0][0].length;

  for (const matrix of matrices) {
    if (matrix.length !== numRows || matrix[0].length !== numCols) {
      throw new Error("All matrices must have the same dimensions.");
    }
  }

  // Initialize the result matrix with zeros
  let resultMatrix = new Array(numRows)
    .fill(null)
    .map(() => new Array(numCols).fill(0));

  // Sum the matrices
  for (const matrix of matrices) {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        resultMatrix[i][j] += matrix[i][j];
      }
    }
  }

  return resultMatrix;
}

function sumMainDiagonal(matrix) {
  // Check if the matrix is square
  if (!matrix.length || matrix.length !== matrix[0].length) {
    throw new Error(
      "Matrix must be square to calculate the sum of the main diagonal."
    );
  }

  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    sum += matrix[i][i]; // Add the diagonal element at [i][i]
  }

  return sum;
}

export default function PairwiseStaticTest({ couples }) {
  const [allPossibleCouples, setAllPossibleCouples] = useState(null);
  const [choise, setChoise] = useState([]);
  const [coupleIndex, setCoupleIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [startTimeChoise, setStartTimeChoise] = useState(Date.now());
  const [transitivityMatrix, setTransitivityMatrix] = useState(
    new Array(10).fill(null).map(() => new Array(10).fill(0))
  );
  const showBlackScreenForPeriodOfTime = useShowBlackScreenForPeriodOfTime();

  const { user, setUser } = useUser();
  const navigate = useNavigate();
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
      const selectedProductIndex =
        allPossibleCouples[coupleIndex][productIndex];
      const nonSelectedProductIndex =
        allPossibleCouples[coupleIndex][1 - productIndex];
      setTransitivityMatrix((prevMatrix) => {
        const newMatrix = prevMatrix.map((row) => [...row]);
        newMatrix[selectedProductIndex][nonSelectedProductIndex] = 1;
        console.log(newMatrix);
        return newMatrix;
      });
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
  const choosePrize = (choices) => {
    let rnd = Math.floor((Math.random() - 0.01) * choices.length);
    return choices[rnd].win;
  };
  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const handleDone = async () => {
      const x1 = transitivityMatrix;
      const x2 = multiplyMatrices(x1, x1);
      const x3 = multiplyMatrices(x2, x1);
      const x4 = multiplyMatrices(x3, x1);
      const x5 = multiplyMatrices(x4, x1);
      const x6 = multiplyMatrices(x5, x1);
      const x7 = multiplyMatrices(x6, x1);
      const x8 = multiplyMatrices(x7, x1);
      const x9 = multiplyMatrices(x8, x1);
      const x10 = multiplyMatrices(x9, x1);
      const X = sumMatrices(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);
      console.log("X is ", X);
      const transitivityResult = sumMainDiagonal(X);
      let timeTakenCalculation = (Date.now() - startTime) / 1000;
      let stage2Timestamp = Date.now();
      let prize = choosePrize([...choise, ...user.preferencesStage1]);
      await setUserOnDb({
        ...user,
        preferencesStage2Choises: choise,
        testNumber: 7,
        timeTaken: timeTakenCalculation,
        stage2Timestamp: stage2Timestamp,
        transitivityResult: transitivityResult,
        prize: prize,
      });
      setUser((prev) => ({
        ...prev,
        preferencesStage2Choises: choise,
        testNumber: 7,
        timeTaken: timeTakenCalculation,
        stage2Timestamp: stage2Timestamp,
        transitivityResult: transitivityResult,
        prize: prize,
      }));
      navigate(ROUTES.FEEDBACK);
    };

    if (coupleIndex >= allPossibleCouples?.length) {
      handleDone();
    }
  }, [
    coupleIndex,
    startTime,
    choise,
    navigate,
    setUser,
    user,
    allPossibleCouples,
    transitivityMatrix,
  ]);

  return (
    <Box padding={10}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        Please select your preferred product
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
