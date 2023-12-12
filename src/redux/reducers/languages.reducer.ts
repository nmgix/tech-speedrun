import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LanguagesCharacteristicsList, LanguagesShort } from "../../types/languages";
import { makeInputPrediction, splitPath } from "../../components/Search/functions";
import { v4 as uuidv4 } from "uuid";

export type LanguagesState = {
  selectId: string;
  // lastUpdated: string | null;
  selectedLanguages: LanguagesShort;
  static: {
    short: LanguagesShort | null;
    characteristicsList: LanguagesCharacteristicsList | null;
  };
};

export const initialState: LanguagesState = {
  selectId: uuidv4(),
  // lastUpdated: null,
  selectedLanguages: {
    frontend: { react: "react", redux: "redux" },
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
      return { ...state, selectedLanguages: action.payload, selectId: uuidv4() /*, lastUpdated: null*/ };
    },
    addLanguageToResult: (state, action: PayloadAction<string>) => {
      const word = splitPath(action.payload).pop();
      const exists = makeInputPrediction(action.payload, { ...state.selectedLanguages });
      if (exists && exists.currentPredictionWord === word) {
        console.error("word in list aready");
        return state;
      } else {
        // вот тут вешать фокус если добавлен в result list
        // а он здесь добавлен, так что вешаться фокус автоматически будет на resultList
        // можно попробовать в хук в котором в dependencies стоит options.focus сделать сокращение пути если точно знаешь где находится элемент чтобы не мапать всё что можно как хук делает обычно

        // тут костыль, но мне лень логику усложнять
        const newLangs = Object.assign({}, state.selectedLanguages);
        // if (exists) {
        //   return state;
        // } else {
        const path = splitPath(action.payload);
        newLangs[path[0]] = newLangs[path[0]] || {};
        // @ts-expect-error мне лень логику усложнять
        newLangs[path[0]][word!] = word;
        // }
        // return { ...state, selectedLanguages: newLangs }; //immer меня задолбал
        state.selectedLanguages = newLangs;
        state.selectId = uuidv4();
        // state.lastUpdated = action.payload;
        return state;
      }
    },
    removeLanguageFromResult: (state, action: PayloadAction<string>) => {
      const word = splitPath(action.payload).pop();
      const exists = makeInputPrediction(action.payload, { ...state.selectedLanguages });
      if (!exists) {
        // вот тут вешать фокус если НЕ добавлен в result list
        // а он здесь не добавлен, так что вешаться фокус автоматически будет на langList
        // можно попробовать в хук в котором в dependencies стоит options.focus сделать сокращение пути если точно знаешь где находится элемент чтобы не мапать всё что можно как хук делает обычно

        return state;
      } else {
        console.log(2);
        const newLangs = Object.assign({}, state.selectedLanguages);
        const path = splitPath(action.payload);
        delete newLangs[path[0]][word!];
        if (Object.keys(newLangs[path[0]]).length === 0) delete newLangs[path[0]];
        // return { ...state, selectedLanguages: newLangs }; //immer меня задолбал
        state.selectedLanguages = newLangs;
        state.selectId = uuidv4();
        // state.lastUpdated = action.payload;
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
