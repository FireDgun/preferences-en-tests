import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { OPTIONS, OPTIONS_NAME } from "../optionsModel";
import {
  group1Couples as group1,
  group2Couples as group2,
} from "../../utils/productsGroupsModels";
import { setUserOnDb } from "../../auth/authService";
import { useUser } from "../../providers/UserProvider";
import { useShowBlackScreenForPeriodOfTime } from "../../providers/ShowBlackScreenForPeriodOfTimeProvider";
import DesignedButton from "../components/DesignedButton";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routesModel";
// function shuffleAndGroup(arr) {
//   // Flatten the array
//   const flatArray = arr.flat();

//   // Shuffle the flat array using the Fisher-Yates algorithm
//   for (let i = flatArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const temp = flatArray[i];
//     flatArray[i] = flatArray[j];
//     flatArray[j] = temp;
//   }

//   // Regroup the flat array into arrays of two elements
//   const result = [];
//   for (let i = 0; i < flatArray.length; i += 2) {
//     result.push([flatArray[i], flatArray[i + 1]]);
//   }

//   return result;
// }
function shuffleArray(array) {
  let copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const dummyCouples = shuffleArray([
  [10, 11],
  [12, 10],
  [11, 14],
  [13, 11],
  [12, 13],
  [14, 13],
]);
export default function SimplePreferencesTest() {
  const [choise, setChoise] = useState([]);
  const [coupleIndex, setCoupleIndex] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const showBlackScreenForPeriodOfTime = useShowBlackScreenForPeriodOfTime();
  const { user, setUser } = useUser();
  const [group1Couples, setGroup1Couples] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.group % 2 === 0) {
        setGroup1Couples([...shuffleArray(group1), ...dummyCouples]);
      } else {
        setGroup1Couples([...shuffleArray(group2), ...dummyCouples]);
      }
    }
  }, [user]);
  console.log(user);
  const handleChooseProduct = async (productIndex) => {
    showBlackScreenForPeriodOfTime(500);
    if (coupleIndex < group1Couples.length) {
      if (coupleIndex < group1Couples.length - dummyCouples.length) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time taken in milliseconds
        setStartTime(Date.now());

        setChoise((prev) => [
          ...prev,
          {
            win: OPTIONS_NAME[
              "OPTION" + group1Couples[coupleIndex][productIndex]
            ],
            lose: OPTIONS_NAME[
              "OPTION" + group1Couples[coupleIndex][1 - productIndex]
            ],
            timeTaken: timeTaken,
          },
        ]);
      }
      setCoupleIndex((prev) => prev + 1);
    } else {
      console.log("done");
    }
  };
  const handleDone = useCallback(async () => {
    let now = Date.now();
    await setUserOnDb({
      ...user,
      preferencesStage1: choise,
      stage: 2,
      stage1Timestamp: now,
    });
    setUser((prev) => ({
      ...prev,
      preferencesStage1: choise,
      stage: 2,
      stage1Timestamp: now,
    }));
    navigate(ROUTES.TEST_STAGE_ONE_FINISH);
  }, [choise, setUser, user, navigate]);

  useEffect(() => {
    if (coupleIndex === group1Couples.length && group1Couples.length > 0) {
      handleDone();
    }
  }, [coupleIndex, handleDone, group1Couples.length]);

  return (
    <Box padding={10}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", padding: 5 }}
      >
        Please select your preferred product
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", padding: 5 }}>
        Choice {coupleIndex + 1} of {group1Couples?.length}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {coupleIndex < group1Couples.length && (
          <Box key={coupleIndex}>
            <DesignedButton
              onClick={() => handleChooseProduct(0)}
              sx={{ marginX: 1 }}
            >
              <img
                src={OPTIONS["OPTION" + group1Couples[coupleIndex][0]]}
                alt="option1"
                style={{ width: 250, height: 250 }}
              />
            </DesignedButton>
            <DesignedButton
              onClick={() => handleChooseProduct(1)}
              sx={{ marginX: 1 }}
            >
              <img
                src={OPTIONS["OPTION" + group1Couples[coupleIndex][1]]}
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
