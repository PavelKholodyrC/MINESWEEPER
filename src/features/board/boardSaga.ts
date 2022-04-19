import { call, put, take, race, fork, takeEvery } from "redux-saga/effects";

import { END, eventChannel } from "redux-saga";
import {
  sendSignal,
  setBoard,
  setErrors,
  setGameStart,
  wsClose,
} from "./boardSlice";
import { PayloadAction } from "@reduxjs/toolkit";

const { REACT_APP_WS_URL: wsURL } = process.env;

export function* boardSagas() {
  yield takeEvery(sendSignal, sendWSSignalSaga);
  yield fork(wsInit);
}

const GAME_SIZE = 10;

export enum AppWSStatus {
  gameStart = "new:",
  map = "map:",
  open = "open:",
  cell = "□",
}

let socket: WebSocket;
const maxReconnectAttempts = 3;
let reconnectAttempts = 0;

const wsSend = (jsonData: string) => {
  if (!socket.readyState) {
    setTimeout(() => {
      wsSend(jsonData);
    }, 100);
  } else {
    socket.send(jsonData);
  }
};

function createSocketChannel() {
  return eventChannel((emit) => {
    socket = new WebSocket(wsURL as string);

    socket.onopen = () => {
      wsSend("help");
    };

    socket.onerror = () => {
      socket.close();
    };

    socket.onmessage = (event) => {
      emit(event);
    };

    socket.onclose = (e) => {
      if (e.wasClean) {
        emit(END);
      } else if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts += 1;
        setTimeout(() => {
          createSocketChannel();
        }, 4000);
      }
    };

    const unsubscribe = () => {
      socket.onmessage = null;
    };

    return unsubscribe;
  });
}

function* updateDataState(message: string) {
  if (message.search(AppWSStatus.gameStart) >= 0) {
    yield put(setGameStart(true));
    yield put(sendSignal("map"));
  }

  if (message.search(AppWSStatus.map) >= 0) {
    const _cells = message
      .split(AppWSStatus.map)[1]
      .replace(/(\r\n|\n|\r)/gm, "")
      .split("");

    const cells = [];

    const createRowData = (start: number) => {
      const cell = [];
      for (var i = 0; i < GAME_SIZE; i++) {
        cell.push({
          id: `open ${i} ${start}`,
          value: _cells[start * 10 + i],
        });
      }
      return cell;
    };

    for (var i = 0; i < GAME_SIZE; i++) {
      cells.push(createRowData(i));
    }
    yield put(setBoard(cells.flat()));
  }
  if (message.search(AppWSStatus.open) >= 0) {
    yield put(sendSignal("map"));
  }
  // yield call(setBoard, message.board as ICell[]);
}

function* listenForSocketMessages() {
  const socketChannel: string = yield call(createSocketChannel);
  while (true) {
    const { data: socketData } = yield take(socketChannel);
    yield fork(updateDataState, socketData);
  }
}

export function* wsInit() {
  yield race({
    task: call(listenForSocketMessages),
    cancel: take(wsClose),
  });
  if (socket) {
    socket.close();
  }
}

export function* sendWSSignalSaga({ payload }: PayloadAction<string>) {
  try {
    socket.send(payload);
  } catch ({ message = "" }) {
    yield put(setErrors(message as string));
  }
}
