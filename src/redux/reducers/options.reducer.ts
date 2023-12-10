import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type OptionsState = {
  focus: string | null;
  searchActive: boolean;
  keybindsHelperActive: boolean;
  switches: {
    currentLangEN: boolean;
    listTypeReal: boolean;
  };
};

export const initialState: OptionsState = {
  focus: null,
  searchActive: false,
  keybindsHelperActive: false,
  switches: {
    currentLangEN: true,
    listTypeReal: false
  }
};

const OptionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setSwitch: (state, action: PayloadAction<{ field: keyof OptionsState["switches"]; active: boolean }>) => {
      return { ...state, switches: { ...state.switches, [action.payload.field]: action.payload.active } };
    },
    setFocusPath: (state, action: PayloadAction<OptionsState["focus"]>) => {
      return { ...state, focus: action.payload };
    },

    setKeybindsHelper: (state, action: PayloadAction<OptionsState["keybindsHelperActive"]>) => {
      return { ...state, keybindsHelperActive: action.payload };
    },
    toggleKeybindsHelper: state => {
      return { ...state, keybindsHelperActive: !state.keybindsHelperActive };
    },
    setSearchState: (state, action: PayloadAction<OptionsState["searchActive"]>) => {
      return { ...state, searchActive: action.payload };
    },
    toggleSearch: state => {
      return { ...state, searchActive: !state.searchActive };
    }
  }
});

export const optionsActions = OptionsSlice.actions;
export default OptionsSlice.reducer;
