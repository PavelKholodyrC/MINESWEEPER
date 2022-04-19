import { Box } from "@mui/material";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import { blueGrey, green, red } from "@mui/material/colors";
import React from "react";
import { ICell } from "../../boardSlice";

interface ICellProps extends ICell {
  onClick: (positions: string) => void;
  index: number;
}

const getBgColor = (value: string) => {
  switch (value) {
    case "0":
      return green[300];
    case "1":
      return green[500];
    case "2":
      return green[900];
    case "*":
      return red[400];
    default:
      return "#fff";
  }
};

const placeHolder = (value: string) => {
  switch (value) {
    case "1":
      return <>1</>;
    case "2":
      return <>2</>;
    case "*":
      return <StarPurple500Icon />;
    default:
      return "";
  }
};

function Cell({ value, index, onClick, id }: ICellProps) {
  return (
    <Box
      onClick={() => onClick(id)}
      sx={{
        border: `1px solid ${blueGrey[300]}`,
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: getBgColor(value),
      }}
    >
      {placeHolder(value)}
    </Box>
  );
}

export default Cell;
