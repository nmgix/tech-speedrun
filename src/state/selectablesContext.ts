import React from "react";
import { LanguagesShort } from "../types/languages";

export type SelectablesState = {
  selectedLanguages: LanguagesShort;
  setSelectedLanguages: (resultLanguages: LanguagesShort) => void;
};

export const defaultState: SelectablesState = {
  selectedLanguages: {},
  setSelectedLanguages: () => console.log("set selected languages hook not inited in context")
};

export const SelectablesContext = React.createContext<SelectablesState>(defaultState);
SelectablesContext.displayName = "SelectablesContext";
