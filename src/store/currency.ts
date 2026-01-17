import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Currency = {
  language: string;
};

const initialState: Currency = {
  language: 'en-US',
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage: setLanguageAction } = currencySlice.actions;

export default currencySlice.reducer;
