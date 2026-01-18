import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
  MigrationManifest,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import themeReducer from './theme';
import walletsReducer from './wallets';
import transactionsReducer from './transactions';
import currencyReducer from './currency';
import languageReducer from './language';
import Migrations from './migration';
import filtersReducer from './filters';
import categoriesReducer from './categories';
import budgetsReducer from './budgets';
import entitiesReducer from './entities';
import valuationsReducer from './valuations';

const rootReducer = combineReducers({
  theme: themeReducer,
  wallets: walletsReducer,
  transactions: transactionsReducer,
  currency: currencyReducer,
  language: languageReducer,
  filters: filtersReducer,
  categories: categoriesReducer,
  budgets: budgetsReducer,
  entities: entitiesReducer,
  valuations: valuationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'sushi-v1',
  version: 2,
  storage: AsyncStorage,
  whitelist: ['theme', 'wallets', 'transactions', 'currency', 'language', 'categories', 'budgets', 'entities', 'valuations'],
  migrate: createMigrate(Migrations as unknown as MigrationManifest, {
    debug: false,
  }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const { run: runSaga } = sagaMiddleware;
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(sagaMiddleware),
  });
  const persistor = persistStore(store);
  return { store, persistor, runSaga };
};
