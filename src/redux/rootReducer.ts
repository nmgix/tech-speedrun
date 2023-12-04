import { combineReducers } from "@reduxjs/toolkit";
import LanguagesReducer, { languagesActions } from "./reducers/languages.reducer";
import SearchReducer, { searchActions } from "./reducers/search.reducer";
import OptionsReducer, { optionsActions } from "./reducers/options.reducer";

export const rootReducer = combineReducers({
  languages: LanguagesReducer,
  search: SearchReducer,
  options: OptionsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const ActionCreators = {
  ...languagesActions,
  ...searchActions,
  ...optionsActions
};
