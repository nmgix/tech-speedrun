import { bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "./rootReducer";
import { RootState } from "./rootReducer";
import store from "./store";

export const useAction = () => bindActionCreators(ActionCreators, useDispatch());
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

import { HistoryCombinations } from "../types/combinations";
import { useHotkeys } from "react-hotkeys-hook";
import { ActionCreators as HistoryActionCreators } from "redux-undo";
import { scopeActive } from "./reducers/hotkeys.reducer";
export const useUndoable = () => {
  const historyActive = useSelector((state: RootState) => scopeActive(state, "main-history"));

  useHotkeys(
    HistoryCombinations.undo,
    () => {
      if (historyActive) store.dispatch(HistoryActionCreators.undo());
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true
    },
    [historyActive]
  );
  useHotkeys(
    HistoryCombinations.redo,
    () => {
      if (historyActive) store.dispatch(HistoryActionCreators.redo());
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true
    },
    [historyActive]
  );
};
