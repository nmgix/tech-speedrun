import React from "react";

export interface KeysState {
  searchActive: boolean;
  updateSearch: (active: boolean) => void;

  fieldActive: number | null;
}

export const defaultState: KeysState = {
  searchActive: false,
  updateSearch: () => {},
  fieldActive: null
};

export const KeysContext = React.createContext<KeysState>(defaultState);
