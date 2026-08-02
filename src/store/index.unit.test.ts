jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

import createAppStore from './index';
import { createWalletAction } from './wallets';

describe('store', () => {
  test('creates a store and persistor with the expected initial shape', async () => {
    const { store, persistor } = createAppStore();

    expect(typeof persistor.purge).toBe('function');

    const state = store.getState();
    expect(Object.keys(state)).toEqual(
      expect.arrayContaining([
        'theme',
        'wallets',
        'transactions',
        'currency',
        'language',
        'filters',
        '_persist',
      ]),
    );
    expect(state.wallets).toEqual({});
    expect(state.transactions).toEqual({});
    expect(state.currency).toEqual({ language: 'en-US' });
    expect(state.language).toEqual({ selected: 'en-US' });

    persistor.purge();
  });

  test('dispatching an action updates state through the wired-up reducers', () => {
    const { store, persistor } = createAppStore();

    store.dispatch(createWalletAction({ label: 'Cash', initialAmount: 100 }));

    const walletIds = Object.keys(store.getState().wallets);
    expect(walletIds).toHaveLength(1);
    expect(store.getState().wallets[walletIds[0]].label).toBe('Cash');

    persistor.purge();
  });
});
