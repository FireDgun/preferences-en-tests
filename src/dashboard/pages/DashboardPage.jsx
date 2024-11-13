import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoginToDashboard from "./LoginToDashboard";
import ResultsTable from "../components/ResultsTable";
import { getAllUsers } from "../../auth/authService";
import adminUser from "../../lib/adminUser";

export default function DashboardPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([]);
  const [started, setStarted] = useState(0);
  const [stage1, setStage1] = useState(0);
  const [stage2, setStage2] = useState(0);
  useEffect(() => {
    const getAllData = async () => {
      let allUsers = await getAllUsers();
      allUsers = allUsers.filter((user) => user.id !== adminUser.id);
      setData(allUsers);
      setStarted(allUsers.length);
      setStage1(allUsers.filter((user) => user.stage >= 2).length);
      setStage2(allUsers.filter((user) => user.stage === 3).length);
      setIsLoading(false);
    };
    getAllData();
  }, []);

  if (!isLogged) {
    return <LoginToDashboard setIsLogged={setIsLogged} />;
  }
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Box sx={{ direction: "rtl" }}>
      <Typography variant="h2" p={1}>
        ברוך הבא ללוח הבקרה
      </Typography>

      <DataTable started={started} stage1={stage1} stage2={stage2} />
      {data && <ResultsTable data={data} />}
    </Box>
  );
}
