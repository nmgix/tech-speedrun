import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";

export type HotkeysState = {
  activeScopes: string[];
};

export const initialState: HotkeysState = {
  activeScopes: ["main-history"]
};

const HotkeysSlice = createSlice({
  name: "hotkeys",
  initialState,
  reducers: {
    setScope: (state, action: PayloadAction<{ scope: string; active: boolean }>) => {
      return {
        ...state,
        activeScopes: !action.payload.active
          ? state.activeScopes.filter(s => s !== action.payload.scope)
          : [...state.activeScopes, action.payload.scope]
      };
    }
  }
});

export const scopeActive = createSelector(
  (state: RootState) => state.present.hotkeys.activeScopes,
  (_: RootState, scope: string) => scope,
  (scopes, scope) => scopes.includes(scope)
);

export const hotkeysActions = HotkeysSlice.actions;
export default HotkeysSlice.reducer;
