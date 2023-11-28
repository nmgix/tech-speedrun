import React from "react";
import { LanguagesCharacteristicsList, LanguagesShort } from "../types/languages";

export type LanguagesState = {
  languagesShort: LanguagesShort | null;
  languagesCharacteristicsList: LanguagesCharacteristicsList | null;
};

export const defaultState: LanguagesState = {
  languagesShort: {},
  languagesCharacteristicsList: {}
};

export const LanguagesContext = React.createContext<LanguagesState>(defaultState);
LanguagesContext.displayName = "LanguagesContext";
