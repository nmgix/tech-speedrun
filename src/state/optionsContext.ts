import React from "react";

export type OptionsState = {
  currentLangEN: boolean;
  setLangEN: (en: boolean) => void;
  listTypeReal: boolean;
  setListTypeReal: (fancy: boolean) => void;
};

const defaultState: OptionsState = {
  currentLangEN: true,
  listTypeReal: true,
  setLangEN: () => console.log("set lang en hook not inited in context"),
  setListTypeReal: () => console.log("set list type fancy hook not inited in context")
};

export const OptionsContext = React.createContext<OptionsState>(defaultState);
OptionsContext.displayName = "OptionsContext";
