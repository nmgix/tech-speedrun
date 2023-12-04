import { bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "./rootReducer";
import { RootState } from "./rootReducer";
import store from "./store";

export const useAction = () => bindActionCreators(ActionCreators, useDispatch());
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
