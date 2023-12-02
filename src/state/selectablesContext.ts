import React from "react";
import { LanguagesShort } from "../types/languages";

export type SelectablesState = {
  selectedLanguages: LanguagesShort;
  setSelectedLanguages: (resultLanguages: LanguagesShort) => void;
  addLanguageToResult: (langPath: string) => void;
  removeLanguageFromResult: (langPath: string) => void;
};

export const defaultState: SelectablesState = {
  selectedLanguages: {},
  setSelectedLanguages: () => console.log("set selected languages hook not inited in context"),
  addLanguageToResult: () => console.log("add lang to result function not inited in context"),
  removeLanguageFromResult: () => console.log("remove lang from result function not inited in context")
};

export const SelectablesContext = React.createContext<SelectablesState>(defaultState);
SelectablesContext.displayName = "SelectablesContext";
