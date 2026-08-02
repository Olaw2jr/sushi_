import Migrations from './index';

describe('migrations', () => {
  test('migration 2 backfills paidAt from createdAt on every transaction', () => {
    const state: any = {
      transactions: {
        'transaction-1': {
          id: 'transaction-1',
          sourceWalletId: 'wallet-1',
          destinationWalletId: null,
          category: 'Groceries',
          description: '',
          amount: -50,
          createdAt: '2023-05-01T00:00:00.000Z',
          updatedAt: '2023-05-01T00:00:00.000Z',
        },
        'transaction-2': {
          id: 'transaction-2',
          sourceWalletId: 'wallet-1',
          destinationWalletId: null,
          category: 'Salary',
          description: '',
          amount: 1000,
          createdAt: '2023-06-01T00:00:00.000Z',
          updatedAt: '2023-06-01T00:00:00.000Z',
        },
      },
    };

    const migrated = Migrations[2](state);

    expect(migrated.transactions['transaction-1'].paidAt).toBe(
      '2023-05-01T00:00:00.000Z',
    );
    expect(migrated.transactions['transaction-2'].paidAt).toBe(
      '2023-06-01T00:00:00.000Z',
    );
    // other fields are preserved
    expect(migrated.transactions['transaction-1'].category).toBe('Groceries');
  });
});
