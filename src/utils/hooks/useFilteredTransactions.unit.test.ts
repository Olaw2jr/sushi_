import { renderHookWithStore } from 'utils/testUtils/renderHookWithStore';
import useFilteredTransactions from './useFilteredTransactions';
import { Transactions } from 'store/transactions';

const baseTransaction = {
  sourceWalletId: 'wallet-1',
  destinationWalletId: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const transactions: Transactions = {
  groceries: {
    ...baseTransaction,
    id: 'groceries',
    category: 'Groceries',
    description: 'Weekly shop',
    amount: -50,
    paidAt: '2024-01-05T12:00:00.000Z',
  },
  salary: {
    ...baseTransaction,
    id: 'salary',
    category: 'Income',
    description: 'Monthly salary',
    amount: 1000,
    paidAt: '2024-01-01T12:00:00.000Z',
  },
  transferOut: {
    ...baseTransaction,
    id: 'transferOut',
    sourceWalletId: 'wallet-1',
    destinationWalletId: 'wallet-2',
    category: 'Transfer',
    description: '',
    amount: -20,
    paidAt: '2024-01-10T12:00:00.000Z',
  },
  otherAccount: {
    ...baseTransaction,
    id: 'otherAccount',
    sourceWalletId: 'wallet-2',
    category: 'Dining',
    description: 'Lunch',
    amount: -15,
    paidAt: '2024-01-08T12:00:00.000Z',
  },
};

const noFilters = {
  startDate: null,
  endDate: null,
  searchTerm: '',
  accountId: null,
  transactionType: null,
};

describe('useFilteredTransactions', () => {
  test('returns all transactions sorted most-recent-first when no filters apply', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: noFilters,
    });

    expect(result.current.filteredTransactions.map((t) => t.id)).toEqual([
      'transferOut',
      'otherAccount',
      'groceries',
      'salary',
    ]);
  });

  test('groups the filtered transactions by day, most recent day first', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: noFilters,
    });

    expect(
      result.current.dailyFilteredTransactions.map((group) =>
        group.data.map((t) => t.id),
      ),
    ).toEqual([['transferOut'], ['otherAccount'], ['groceries'], ['salary']]);
  });

  test('filters by search term against category and description', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: { ...noFilters, searchTerm: 'lunch' },
    });

    expect(result.current.filteredTransactions.map((t) => t.id)).toEqual([
      'otherAccount',
    ]);
  });

  test('filters by date range using only startDate (defaults endDate to startDate)', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: {
        ...noFilters,
        startDate: new Date('2024-01-05T00:00:00.000Z'),
      },
    });

    expect(result.current.filteredTransactions.map((t) => t.id)).toEqual([
      'groceries',
    ]);
  });

  test('filters by an explicit date range', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: {
        ...noFilters,
        startDate: new Date('2024-01-05T00:00:00.000Z'),
        endDate: new Date('2024-01-10T00:00:00.000Z'),
      },
    });

    expect(result.current.filteredTransactions.map((t) => t.id).sort()).toEqual(
      ['groceries', 'otherAccount', 'transferOut'].sort(),
    );
  });

  test('filters by accountId matching either source or destination wallet', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: { ...noFilters, accountId: 'wallet-2' },
    });

    expect(result.current.filteredTransactions.map((t) => t.id).sort()).toEqual(
      ['otherAccount', 'transferOut'].sort(),
    );
  });

  test('filters DEBIT to positive, non-transfer transactions', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: { ...noFilters, transactionType: 'DEBIT' },
    });

    expect(result.current.filteredTransactions.map((t) => t.id)).toEqual([
      'salary',
    ]);
  });

  test('filters CREDIT to negative, non-transfer transactions', () => {
    const { result } = renderHookWithStore(() => useFilteredTransactions(), {
      transactions,
      filters: { ...noFilters, transactionType: 'CREDIT' },
    });

    expect(result.current.filteredTransactions.map((t) => t.id).sort()).toEqual(
      ['groceries', 'otherAccount'].sort(),
    );
  });

  test('local overrides passed to the hook take precedence over global filters', () => {
    const { result } = renderHookWithStore(
      () => useFilteredTransactions({ accountId: 'wallet-2' }),
      {
        transactions,
        filters: { ...noFilters, accountId: 'wallet-1' },
      },
    );

    expect(result.current.filteredTransactions.map((t) => t.id).sort()).toEqual(
      ['otherAccount', 'transferOut'].sort(),
    );
  });
});
