import React from "react";

export type LanguagesState = { [techScope: string]: { [language: string]: string } };

export const defaultState: LanguagesState = {};

export const LanguagesContext = React.createContext<LanguagesState>(defaultState);
LanguagesContext.displayName = "LanguagesContext";
