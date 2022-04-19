import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface IBoardState {
  fetching: boolean;
  error: string | null;
  gameStart: boolean;
  cells: ICell[];
}

export interface ICell {
  id: string;
  value: string;
}

const initialState: IBoardState = {
  fetching: false,
  error: null,
  gameStart: false,
  cells: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    wsInit: (state) => state,
    wsClose: (state) => state,
    setGameStart: (state, { payload }: PayloadAction<boolean>) => {
      state.fetching = false;
      state.error = null;
      state.gameStart = payload;
    },
    setErrors: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
    sendSignal: (state, { payload }: PayloadAction<string>) => {
      state.fetching = Boolean(payload);
      state.error = null;
    },
    setBoard: (state, { payload }: PayloadAction<ICell[]>) => {
      state.cells = payload;
      state.fetching = false;
      state.error = null;
    },
  },
});

export const {
  sendSignal,
  wsInit,
  wsClose,
  setBoard,
  setErrors,
  setGameStart,
} = boardSlice.actions;

export const selectBoard = (state: RootState) => state.board;

export default boardSlice.reducer;
