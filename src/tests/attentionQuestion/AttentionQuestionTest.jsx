import React, { useState } from "react";
import ShowProducts from "../components/ShowProducts";
import { Typography } from "@mui/material";
import RemoveTheBestTest from "../../testsAttentionCheck/removeTheBest/RemoveTheBestTest";
import RemoveTheWorstTest from "../../testsAttentionCheck/removeTheWorst/RemoveTheWorstTest";
import BottomUpTest from "../../testsAttentionCheck/bottomUp/BottomUpTest";
import TopDownTest from "../../testsAttentionCheck/topDown/TopDownTest";
import IterativeCategorizationManager from "../../testsAttentionCheck/iterativeCategorization/IterativeCategorizationManager";
import StaticTestManager from "../../testsAttentionCheck/static/StaticTestManager";
import PairwiseStaticTest from "../../testsAttentionCheck/pairwiseStatic/PairwiseStaticTest";

export default function AttentionQuestionTest({ handleFinish, testNumber }) {
  const [isFinishFirstAttentionQuestion, setIsFinishFirstAttentionQuestion] =
    useState(false);
  return (
    <>
      {isFinishFirstAttentionQuestion ? (
        <div>
          {testNumber === 0 && (
            <RemoveTheBestTest
              couples={[
                [15, 16],
                [17, 18],
              ]}
              handleFinish={handleFinish}
            />
          )}
          {testNumber === 1 && (
            <RemoveTheWorstTest
              couples={[
                [15, 16],
                [17, 18],
              ]}
              handleFinish={handleFinish}
            />
          )}
          {testNumber === 2 && (
            <BottomUpTest couples={[[15, 16]]} handleFinish={handleFinish} />
          )}
          {testNumber === 3 && (
            <TopDownTest couples={[[15, 16]]} handleFinish={handleFinish} />
          )}
          {testNumber === 4 && (
            <IterativeCategorizationManager
              couples={[[15, 16]]}
              handleFinish={handleFinish}
            />
          )}
          {testNumber === 5 && (
            <StaticTestManager
              couples={[
                [15, 16],
                [17, 18],
              ]}
              handleFinish={handleFinish}
            />
          )}
          {testNumber === 6 && (
            <PairwiseStaticTest
              couples={[[15, 16]]}
              handleFinish={handleFinish}
            />
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h4" align="center" mb={10}>
            Please choose the wallet
          </Typography>
          <ShowProducts
            products={[10, 11, 12, 13]}
            handleChooseProduct={(product) => {
              if (product === 11) {
                localStorage.setItem("attentionQuestion", 0);
                setIsFinishFirstAttentionQuestion(true);
              } else {
                localStorage.setItem("attentionQuestion", 1);
                setIsFinishFirstAttentionQuestion(true);
              }
            }}
            savePlace={false}
          />
        </div>
      )}
    </>
  );
}
