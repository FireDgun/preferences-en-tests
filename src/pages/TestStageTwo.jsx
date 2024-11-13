import React, { useEffect, useState } from "react";
import { useUser } from "../providers/UserProvider";
import { group1Couples } from "../utils/productsGroupsModels";
import RemoveTheBestTest from "../tests/removeTheBest/RemoveTheBestTest";
import RemoveTheWorstTest from "../tests/removeTheWorst/RemoveTheWorstTest";
import BottomUpTest from "../tests/bottomUp/BottomUpTest";
import TopDownTest from "../tests/topDown/TopDownTest";
import PairwiseStaticTest from "../tests/pairwiseStatic/PairwiseStaticTest";
import IterativeCategorizationManager from "../tests/iterativeCategorization/IterativeCategorizationManager";
import StaticTestManager from "../tests/static/StaticTestManager";
import AttentionQuestionTest from "../tests/attentionQuestion/AttentionQuestionTest";
import WelcomeStage2 from "./WelcomeStage2";
// import WelcomeStage2AfterAttention from "./WelcomeStage2AfterAttention";
// Function to shuffle an array
// const shuffleArray = (array) => {
//   const shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// };

function shuffleAndGroup(arr) {
  // Flatten the array
  const flatArray = arr.flat();

  // Shuffle the flat array using the Fisher-Yates algorithm
  for (let i = flatArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = flatArray[i];
    flatArray[i] = flatArray[j];
    flatArray[j] = temp;
  }

  // Regroup the flat array into arrays of two elements
  const result = [];
  for (let i = 0; i < flatArray.length; i += 2) {
    result.push([flatArray[i], flatArray[i + 1]]);
  }

  return result;
}

export default function TestStageTwo() {
  const [couples, setCouples] = useState([]);
  const [testNumber, setTestNumber] = useState(null);
  const [isDidPractice, setIsDidPractice] = useState(false);
  const [isSeeWelcomePage, setIsSeeWelcomePage] = useState(false);
  // const [isSeeWelcomePageAfterAttention, setIsSeeWelcomePageAfterAttention] =
  //   useState(false);

  const { user } = useUser();

  useEffect(() => {
    setCouples(shuffleAndGroup(group1Couples));
  }, []);

  useEffect(() => {
    setTestNumber((user.group - 1) % 7);
  }, [user]);

  if (user === null) return null;
  testNumber === null && <div>Loading...</div>;
  return (
    <>
      {!isSeeWelcomePage ? (
        <WelcomeStage2 handleButtonClick={() => setIsSeeWelcomePage(true)} />
      ) : !isDidPractice ? (
        <>
          <AttentionQuestionTest
            handleFinish={() => setIsDidPractice(true)}
            testNumber={testNumber}
          />
        </>
      ) : (
        // :
        //  !isSeeWelcomePageAfterAttention ? (
        //   <WelcomeStage2AfterAttention
        //     handleButtonClick={() => setIsSeeWelcomePageAfterAttention(true)}
        //   />
        // )
        <>
          {testNumber === 0 && <RemoveTheBestTest couples={couples} />}
          {testNumber === 1 && <RemoveTheWorstTest couples={couples} />}
          {testNumber === 2 && <BottomUpTest couples={couples} />}
          {testNumber === 3 && <TopDownTest couples={couples} />}
          {testNumber === 4 && (
            <IterativeCategorizationManager couples={couples} />
          )}
          {testNumber === 5 && <StaticTestManager couples={couples} />}
          {testNumber === 6 && <PairwiseStaticTest couples={couples} />}
        </>
      )}
    </>
  );
}
