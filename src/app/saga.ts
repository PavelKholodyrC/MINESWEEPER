import { all, fork } from "redux-saga/effects";
import { boardSagas } from "../features/board/boardSaga";

export default function* root() {
  yield all([fork(boardSagas)]);
}
