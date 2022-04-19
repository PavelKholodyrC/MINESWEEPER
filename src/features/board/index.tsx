import { Alert, Box, Paper, Snackbar } from "@mui/material";
import React, { useCallback } from "react";
import Cell from "./components/cell";
import Navigation from "./components/navigation";
import { selectBoard, sendSignal, setErrors } from "./boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Masonry from "@mui/lab/Masonry";

function BoardPage() {
  const { cells, error } = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  const handleCloseError = () => {
    dispatch(setErrors(""));
  };

  const setActiveSell = useCallback(
    (position: string) => {
      dispatch(sendSignal(position));
    },
    [dispatch]
  );

  return (
    <Box sx={{ textAlign: "center" }}>
      <Navigation />
      <Paper elevation={5} sx={{ margin: "auto", width: "600px" }}>
        <Masonry columns={10} spacing={0}>
          {cells.map((c, index) => (
            <Cell key={c.id} onClick={setActiveSell} {...c} index={index} />
          ))}
        </Masonry>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(error)}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BoardPage;
