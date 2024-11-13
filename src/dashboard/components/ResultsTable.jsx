import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TablePagination,
} from "@mui/material";
import * as XLSX from "xlsx";

const colsWithLeftBorder = ["14", "31", "40", "50"];
// Helper function to determine the stage description
const getStageDescription = (stage) => {
  switch (stage) {
    case 1:
      return "Just started";
    case 2:
      return "Finished stage 1";
    case 3:
      return "Finished stage 2";
    default:
      return "";
  }
};

const getTestDescription = (group) => {
  const testNumber = (group - 1) % 7;
  switch (testNumber) {
    case 0:
      return "Remove the best";
    case 1:
      return "Remove the worst";
    case 2:
      return "Bottom up";
    case 3:
      return "Top down";
    case 4:
      return "Iterative categorization";
    case 5:
      return "Static";
    case 6:
      return "Pairwise static";
    default:
      return "";
  }
};

const timestampToDateTimeString = (timestamp) => {
  if (!timestamp) {
    return "-";
  }
  const date = new Date(timestamp);
  return date.toLocaleString("he-IL");
};

const calculatePoints = (user) => {
  if (user.stage !== 3) {
    return 0;
  }
  let points = 0;
  for (let i = 0; i < user?.preferencesStage1?.length; i++) {
    let oldCouple = [
      user.preferencesStage1[i].win,
      user.preferencesStage1[i].lose,
    ];

    if (user.testNumber < 7) {
      let item1Rank = user.preferencesStage2.findIndex(
        (item) => item === user.preferencesStage1[i].win
      );
      let item2Rank = user.preferencesStage2.findIndex(
        (item) => item === user.preferencesStage1[i].lose
      );
      if (item1Rank < item2Rank) {
        points++;
      }
    } else {
      let sameCouple = user.preferencesStage2Choises.find(
        (item) => oldCouple.includes(item.win) && oldCouple.includes(item.lose)
      );

      if (sameCouple.win === oldCouple[0]) {
        points++;
      }
    }
  }
  return points;
};
export default function ResultsTable({ data }) {
  const [flattenedData, setFlattenedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(wb, ws, "תוצאות ניסוי ");
    const date = new Date();
    const dateString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const timeString = date.toTimeString().split(" ")[0].replace(/:/g, "-"); // Format as HH-MM-SS

    // Construct the filename with date and time
    const fileName = `exported_data_${dateString}_${timeString}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };
  useEffect(() => {
    if (data.length > 0) {
      const flatData = data.map((user) => {
        // Initialize the base object with user-specific information translated to Hebrew
        let userObj = {
          Id: user.id,
          Age: user.age,
          Gender: user.gender,
          Group: user.group,
          "Attention Difficulties": user.attentionDifficulties,
          Adhd: user.adhd,
          Prize: user.prize || "",
          feedback: user.feedback || "",
          "transitivity Result":
            typeof user.transitivityResult !== "undefined"
              ? user.transitivityResult
              : "",
          "Answer Attention Question First Try": Boolean(
            user.didAnswerAttentionQuestion
          ).toString(),

          choiseCount: user.choiseCount ? user.choiseCount : "",
          Stage: getStageDescription(user.stage), // Assuming this already returns a Hebrew description
          "Test Name": getTestDescription(user.group), // Assuming this already returns a Hebrew description
          Points: calculatePoints(user),
          "Time stamp stage 1": timestampToDateTimeString(user.stage1Timestamp),
          "Time stamp stage 2": timestampToDateTimeString(user.stage2Timestamp),
        };

        // Handle preferencesStage1 items in Hebrew
        Array.from({ length: 5 }).forEach((_, itemIndex) => {
          const item = user.preferencesStage1?.[itemIndex];
          userObj[`Preferences stage 1' ${itemIndex + 1} - preferred`] = item
            ? item.win
            : "-";
          userObj[`Preferences stage 1' ${itemIndex + 1} - not preferred`] =
            item ? item.lose : "-";
          userObj[`Preferences stage 1' ${itemIndex + 1} - time`] = item
            ? `${item.timeTaken} seconds`
            : "-";
        });

        // Handle preferencesStage2 items for testNumber !== 7 in Hebrew
        Array.from({ length: 4 }).forEach((_, index) => {
          userObj[`Attention Question Preferences stage 2' ${index + 1}`] =
            user.preferencesStage2Attention &&
            user.preferencesStage2Attention.length > index &&
            user.testNumber < 7
              ? user.preferencesStage2Attention[index]
              : "-";
        });

        Array.from({ length: 1 }).forEach((_, itemIndex) => {
          const item = user.preferencesStage2Attention?.[itemIndex];
          userObj[
            `Attention Question Preferences stage 2 dichotomous choise - preferred`
          ] = item?.win ? item.win : "-";
          userObj[
            `Attention Question Preferences stage 2 dichotomous choise - not preferred`
          ] = item?.lose ? item.lose : "-";
          userObj[
            `Attention Question  Preferences stage 2 dichotomous choise  - time`
          ] = item?.timeTaken ? `${item.timeTaken} seconds` : "-";
        });
        userObj["Time stage 2 Attention"] = user.timeTakenAttention
          ? `${user.timeTakenAttention} seconds`
          : "-";
        userObj["Time stage 2"] = user.timeTaken
          ? `${user.timeTaken} seconds`
          : "-";

        // Handle preferencesStage2 items for testNumber !== 7 in Hebrew
        Array.from({ length: 10 }).forEach((_, index) => {
          userObj[`Preferences stage 2' ${index + 1}`] =
            user.preferencesStage2 &&
            user.preferencesStage2.length > index &&
            user.testNumber < 7
              ? user.preferencesStage2[index]
              : "-";
        });

        // Handle preferencesStage2 items for testNumber === 7 in Hebrew
        Array.from({ length: 45 }).forEach((_, itemIndex) => {
          const item = user.preferencesStage2Choises?.[itemIndex];
          userObj[`Preferences stage 2 choise ${itemIndex + 1} - preferred`] =
            item?.win ? item.win : "-";
          userObj[
            `Preferences stage 2 choise ${itemIndex + 1} - not preferred`
          ] = item?.lose ? item.lose : "-";
          userObj[`Preferences stage 2 choise ${itemIndex + 1} - time`] =
            item?.timeTaken ? `${item.timeTaken} seconds` : "-";
        });

        return userObj;
      });

      setFlattenedData(flatData);
      setHeaders(Object.keys(flatData[0]));
    }
  }, [data]);

  return (
    <Box sx={{ maxWidth: "80%", margin: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="contained" onClick={exportToExcel}>
          ייצא לאקסל
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ backgroundColor: "#fafafa" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    borderRight: colsWithLeftBorder.includes(index.toString())
                      ? "1px solid #e0e0e0"
                      : "none",
                  }}
                >
                  {header} {/* Translate or modify as needed for Hebrew */}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {flattenedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                >
                  {headers.map((header, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      align="center"
                      sx={{
                        borderRight: colsWithLeftBorder.includes(
                          colIndex.toString()
                        )
                          ? "1px solid #e0e0e0"
                          : "none",
                      }}
                    >
                      <Typography variant="body2">
                        {item[header] !== undefined ? item[header] : ""}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Table Pagination Component */}
      <TablePagination
        component="div"
        count={flattenedData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page"
      />
    </Box>
  );
}
