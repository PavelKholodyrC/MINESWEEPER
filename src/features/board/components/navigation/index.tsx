import { Box, Button } from "@mui/material";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectBoard, sendSignal } from "../../boardSlice";

function Navigation() {
  const { gameStart } = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  const updateGameState = useCallback(() => {
    dispatch(sendSignal("new 1"));
  }, [dispatch]);

  return (
    <Box sx={{ my: 4, textAlign: "center" }}>
      <Button variant="contained" color="primary" onClick={updateGameState}>
        {!gameStart ? "Start" : "Reset"}
      </Button>
    </Box>
  );
}

export default Navigation;
