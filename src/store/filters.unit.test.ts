import filtersReducer, { applyFiltersAction } from './filters';
import { Filters } from './filters';

describe('filters', () => {
  test('applyFilters replaces the whole filters state', () => {
    const newFilters: Filters = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      searchTerm: 'groceries',
      accountId: 'wallet-1',
      transactionType: 'DEBIT',
    };

    const state = filtersReducer(
      {
        startDate: null,
        endDate: null,
        searchTerm: '',
        accountId: null,
        transactionType: null,
      },
      applyFiltersAction(newFilters),
    );

    expect(state).toEqual(newFilters);
  });
});
