import { Box, Button, Container, TextField } from "@mui/material";
import React, { useState } from "react";
import adminUser from "../../lib/adminUser";

export default function LoginToDashboard({ setIsLogged }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Container sx={{ padding: 10 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          label="אימייל"
          type="email"
          sx={{ m: 3 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="סיסמה"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={() =>
            email === adminUser.email && password === adminUser.password
              ? setIsLogged(true)
              : alert("פרטי ההתחברות שגויים")
          }
          variant="contained"
          sx={{ m: 3 }}
        >
          התחבר
        </Button>
      </Box>
    </Container>
  );
}
