import React from "react";

// export type FieldOptions = "languages_list" | "result_list" | "options";

// field: string - path elements

export interface FocusState {
  field: string | null;
  setActiveField: (field: FocusState["field"]) => void;
}

export const defaultState: FocusState = {
  field: null,
  setActiveField: () => console.error("set active field hook not inited in context")
};

export const FocusContext = React.createContext<FocusState>(defaultState);
FocusContext.displayName = "FocusContext";
