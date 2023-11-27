import React from "react";

export interface SearchState {
  path: string | null;
  setPath: (path: SearchState["path"]) => void;
}

export const defaultState: SearchState = {
  path: null,
  setPath: () => console.error("set path hook not inited in context")
};

export const SearchContext = React.createContext<SearchState>(defaultState);
SearchContext.displayName = "SearchContext";
