import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-native';
import themeReducer from 'store/theme';
import walletsReducer from 'store/wallets';
import transactionsReducer from 'store/transactions';
import currencyReducer from 'store/currency';
import languageReducer from 'store/language';
import filtersReducer from 'store/filters';
import { RootState } from 'store';

const rootReducer = combineReducers({
  theme: themeReducer,
  wallets: walletsReducer,
  transactions: transactionsReducer,
  currency: currencyReducer,
  language: languageReducer,
  filters: filtersReducer,
});

// Lightweight, non-persisted store for hook tests only — mirrors the slice
// shape wired up in store/index.ts without needing AsyncStorage/redux-persist.
export const renderHookWithStore = <Result,>(
  callback: () => Result,
  preloadedState?: Partial<RootState>,
) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
  });

  return renderHook(callback, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
};
