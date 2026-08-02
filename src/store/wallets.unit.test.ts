jest.mock('uuid', () => ({ v1: () => 'test-wallet-id' }));

import walletsReducer, {
  createWalletAction,
  editWalletAction,
  deleteWalletAction,
} from './wallets';

const isValidISODate = (value: string) => !isNaN(Date.parse(value));

describe('wallets', () => {
  test('createWallet adds a new wallet with a generated id and timestamps', () => {
    const state = walletsReducer(
      {},
      createWalletAction({ label: 'Cash', initialAmount: 100 }),
    );

    expect(Object.keys(state)).toEqual(['test-wallet-id']);
    const wallet = state['test-wallet-id'];
    expect(wallet.id).toBe('test-wallet-id');
    expect(wallet.label).toBe('Cash');
    expect(wallet.initialAmount).toBe(100);
    expect(isValidISODate(wallet.createdAt)).toBe(true);
    expect(wallet.createdAt).toBe(wallet.updatedAt);
  });

  test('editWallet replaces the wallet and bumps updatedAt', () => {
    const initialState = {
      'wallet-1': {
        id: 'wallet-1',
        label: 'Cash',
        initialAmount: 100,
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
      },
    };

    const state = walletsReducer(
      initialState,
      editWalletAction({
        id: 'wallet-1',
        label: 'Savings',
        initialAmount: 200,
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
      }),
    );

    expect(state['wallet-1'].label).toBe('Savings');
    expect(state['wallet-1'].initialAmount).toBe(200);
    expect(isValidISODate(state['wallet-1'].updatedAt)).toBe(true);
  });

  test('deleteWallet removes the wallet by id', () => {
    const initialState = {
      'wallet-1': {
        id: 'wallet-1',
        label: 'Cash',
        initialAmount: 100,
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
      },
    };

    const state = walletsReducer(initialState, deleteWalletAction('wallet-1'));

    expect(state).toEqual({});
  });
});
