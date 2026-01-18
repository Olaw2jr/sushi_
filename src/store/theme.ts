import { Appearance } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type THEME_OPTION = 'Light' | 'Dark' | 'Wasabi' | 'SUSHI_2';

export type Theme = {
  base: THEME_OPTION;
};

const initialState: Theme = {
  base: 'SUSHI_2',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<THEME_OPTION>) {
      state.base = action.payload;
    },
  },
});

export const { setTheme: setThemeAction } = themeSlice.actions;

export default themeSlice.reducer;
