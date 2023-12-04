import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  path: string | null;
}

export const initialState: SearchState = {
  path: null
};

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setPath: (state, action: PayloadAction<SearchState["path"]>) => {
      // тут можно какой-то валидатор
      return { ...state, path: action.payload };
    }
  }
});

export const searchActions = SearchSlice.actions;
export default SearchSlice.reducer;
