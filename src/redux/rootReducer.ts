import { combineReducers } from "@reduxjs/toolkit";
import LanguagesReducer, { languagesActions } from "./reducers/languages.reducer";
import OptionsReducer, { optionsActions } from "./reducers/options.reducer";
import undoable, { excludeAction } from "redux-undo";
import HotkeysReducer, { hotkeysActions } from "./reducers/hotkeys.reducer";

export const rootReducer = undoable(
  combineReducers({
    languages: LanguagesReducer,
    hotkeys: HotkeysReducer,
    options: OptionsReducer
  }),
  {
    limit: 20,
    filter: excludeAction([
      optionsActions.setFocusPath.type,
      optionsActions.toggleSearch.type,
      optionsActions.toggleKeybindsHelper.type,
      hotkeysActions.setScope.type
    ])
  }
);

export type RootState = ReturnType<typeof rootReducer>;

export const ActionCreators = {
  ...languagesActions,
  ...hotkeysActions,
  ...optionsActions
};
