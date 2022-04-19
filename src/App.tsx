import { Typography, Container } from "@mui/material";
import React from "react";
import BoardPage from "./features/board";

function App() {
  return (
    <Container fixed sx={{ my: 2 }}>
      <Typography
        color="purple"
        variant="h3"
        component="h1"
        align="center"
        sx={{ textTransform: "uppercase" }}
      >
        Minesweeper
      </Typography>
      <BoardPage />
    </Container>
  );
}

export default App;
