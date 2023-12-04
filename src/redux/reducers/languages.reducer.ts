import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LanguagesCharacteristicsList, LanguagesShort } from "../../types/languages";
import { makeInputPrediction, splitPath } from "../../components/Search/functions";

export type LanguagesState = {
  selectedLanguages: LanguagesShort;
  static: {
    short: LanguagesShort | null;
    characteristicsList: LanguagesCharacteristicsList | null;
  };
};

export const initialState: LanguagesState = {
  selectedLanguages: {
    frontend: { react: "react" },
    others: { typescript: "typescript", vscode: "vscode" }
  },
  static: {
    short: null,
    characteristicsList: null
  }
};

const LanguagesSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    setStaticLanguages: (
      state,
      action: PayloadAction<{
        short: LanguagesShort | null;
        characteristicsList: LanguagesCharacteristicsList | null;
      }>
    ) => {
      return { ...state, static: action.payload };
    },
    setSelectedLanguages: (state, action: PayloadAction<LanguagesShort>) => {
      return { ...state, selectedLanguages: action.payload };
    },
    addLanguageToResult: (state, action: PayloadAction<string>) => {
      const word = splitPath(action.payload).pop();
      const exists = makeInputPrediction(action.payload, { ...state.selectedLanguages });
      if (exists && exists.currentPredictionWord === word) {
        console.error("word in list aready");
        return state;
      } else {
        // тут костыль, но мне лень логику усложнять
        const newLangs = Object.assign({}, { ...state.selectedLanguages });
        if (exists) {
          return state;
        } else {
          const path = splitPath(action.payload);
          newLangs[path[0]] = newLangs[path[0]] || {};
          // @ts-expect-error мне лень логику усложнять
          newLangs[path[0]][word!] = word;
        }
        // return { ...state, selectedLanguages: newLangs }; //immer меня задолбал
        state.selectedLanguages = newLangs;
        return state;
      }
    },
    removeLanguageFromResult: (state, action: PayloadAction<string>) => {
      const word = splitPath(action.payload).pop();
      const exists = makeInputPrediction(action.payload, { ...state.selectedLanguages });
      if (!exists) return state;
      else {
        const newLangs = Object.assign({}, { ...state.selectedLanguages });
        const path = splitPath(action.payload);
        delete newLangs[path[0]][word!];
        if (Object.keys(newLangs[path[0]]).length === 0) delete newLangs[path[0]];
        // return { ...state, selectedLanguages: newLangs }; //immer меня задолбал
        state.selectedLanguages = newLangs;
        return state;
      }
    },

    setStaticData: (state, action: PayloadAction<LanguagesState["static"]>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const languagesActions = LanguagesSlice.actions;
export default LanguagesSlice.reducer;
