import React from "react";

export interface KeysState {
  searchActive: boolean;
  updateSearch: (active: boolean) => void;
}

export const defaultState: KeysState = {
  searchActive: false,
  updateSearch: () => console.error("update search hook not inited in context")
};

export const KeysContext = React.createContext<KeysState>(defaultState);
KeysContext.displayName = "KeysContext";
