jest.mock('uuid', () => ({ v1: () => 'test-transaction-id' }));

import transactionsReducer, {
  createTransactionAction,
  editTransactionAction,
  deleteTransactionAction,
} from './transactions';
import { deleteWalletAction } from './wallets';

const isValidISODate = (value: string) => !isNaN(Date.parse(value));

describe('transactions', () => {
  test('createTransaction adds a new transaction with a generated id and timestamps', () => {
    const state = transactionsReducer(
      {},
      createTransactionAction({
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Groceries',
        description: 'Weekly shop',
        amount: -50,
        paidAt: '2024-01-01T00:00:00.000Z',
      }),
    );

    expect(Object.keys(state)).toEqual(['test-transaction-id']);
    const transaction = state['test-transaction-id'];
    expect(transaction.category).toBe('Groceries');
    expect(transaction.amount).toBe(-50);
    expect(isValidISODate(transaction.createdAt)).toBe(true);
    expect(transaction.createdAt).toBe(transaction.updatedAt);
  });

  test('editTransaction replaces the transaction and bumps updatedAt', () => {
    const initialState = {
      'transaction-1': {
        id: 'transaction-1',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Groceries',
        description: 'Weekly shop',
        amount: -50,
        paidAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    };

    const state = transactionsReducer(
      initialState,
      editTransactionAction({
        ...initialState['transaction-1'],
        category: 'Dining',
        amount: -75,
      }),
    );

    expect(state['transaction-1'].category).toBe('Dining');
    expect(state['transaction-1'].amount).toBe(-75);
    expect(isValidISODate(state['transaction-1'].updatedAt)).toBe(true);
  });

  test('deleteTransaction removes the transaction by id', () => {
    const initialState = {
      'transaction-1': {
        id: 'transaction-1',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Groceries',
        description: 'Weekly shop',
        amount: -50,
        paidAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    };

    const state = transactionsReducer(
      initialState,
      deleteTransactionAction('transaction-1'),
    );

    expect(state).toEqual({});
  });

  test('deleting a wallet cascades to remove its source and destination transactions only', () => {
    const initialState = {
      'source-match': {
        id: 'source-match',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Groceries',
        description: '',
        amount: -50,
        paidAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      'destination-match': {
        id: 'destination-match',
        sourceWalletId: 'wallet-2',
        destinationWalletId: 'wallet-1',
        category: 'Transfer',
        description: '',
        amount: -20,
        paidAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      unrelated: {
        id: 'unrelated',
        sourceWalletId: 'wallet-2',
        destinationWalletId: null,
        category: 'Salary',
        description: '',
        amount: 1000,
        paidAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    };

    const state = transactionsReducer(
      initialState,
      deleteWalletAction('wallet-1'),
    );

    expect(Object.keys(state)).toEqual(['unrelated']);
  });
});
