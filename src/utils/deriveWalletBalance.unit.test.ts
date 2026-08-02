import { deriveWalletBalance } from './deriveWalletBalance';
import { Transaction } from 'store/transactions';

const baseTransaction = {
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  paidAt: '2024-01-01T00:00:00.000Z',
  description: '',
};

describe('deriveWalletBalance', () => {
  test('adds positive amounts to income and negative amounts to expenses', () => {
    const transactions: Transaction[] = [
      {
        ...baseTransaction,
        id: 'salary',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Income',
        amount: 1000,
      },
      {
        ...baseTransaction,
        id: 'groceries',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Groceries',
        amount: -50,
      },
    ];

    expect(deriveWalletBalance('wallet-1', 100, transactions)).toEqual({
      balance: 1050,
      income: 1000,
      expenses: 50,
    });
  });

  test('reverses the sign for transfers where this wallet is the destination', () => {
    const transactions: Transaction[] = [
      {
        ...baseTransaction,
        id: 'transferIn',
        sourceWalletId: 'wallet-2',
        destinationWalletId: 'wallet-1',
        category: 'Transfer',
        amount: -20,
      },
    ];

    // -20 recorded from the sender's perspective becomes +20 income here,
    // since this wallet is on the receiving end of the transfer.
    expect(deriveWalletBalance('wallet-1', 0, transactions)).toEqual({
      balance: 20,
      income: 20,
      expenses: 0,
    });
  });

  test('does not reverse the sign for transfers where this wallet is the source', () => {
    const transactions: Transaction[] = [
      {
        ...baseTransaction,
        id: 'transferOut',
        sourceWalletId: 'wallet-1',
        destinationWalletId: 'wallet-2',
        category: 'Transfer',
        amount: -20,
      },
    ];

    expect(deriveWalletBalance('wallet-1', 100, transactions)).toEqual({
      balance: 80,
      income: 0,
      expenses: 20,
    });
  });

  test('ignores zero-amount transactions', () => {
    const transactions: Transaction[] = [
      {
        ...baseTransaction,
        id: 'zero',
        sourceWalletId: 'wallet-1',
        destinationWalletId: null,
        category: 'Adjustment',
        amount: 0,
      },
    ];

    expect(deriveWalletBalance('wallet-1', 100, transactions)).toEqual({
      balance: 100,
      income: 0,
      expenses: 0,
    });
  });

  test('returns just the initial amount when there are no transactions', () => {
    expect(deriveWalletBalance('wallet-1', 100, [])).toEqual({
      balance: 100,
      income: 0,
      expenses: 0,
    });
  });
});
