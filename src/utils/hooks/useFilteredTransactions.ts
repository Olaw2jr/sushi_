import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { allPass, groupBy, partial, reverse, sortBy } from 'ramda';
import { useAppSelector } from 'store';
import { Filters } from 'store/filters';
import { Transaction } from 'store/transactions';
import { formatDate } from 'utils/formatDate';

const isSearchTermMatch = (filter: Filters, t: Transaction) => {
  const filterSearchTerm = filter.searchTerm.toLowerCase();
  const description = t.description.toLowerCase();
  const category = t.category.toLowerCase();
  return `${category} ${description}`.includes(filterSearchTerm);
};

const isDateRangeMatch = (filter: Filters, t: Transaction) => {
  if (filter.startDate) {
    const startDate = startOfDay(filter.startDate);
    const endDate = endOfDay(
      filter.endDate ? filter.endDate : filter.startDate,
    );
    return isWithinInterval(new Date(t.paidAt), {
      start: startDate,
      end: endDate,
    });
  }

  // no filter
  return true;
};

const isAccountMatch = (filter: Filters, t: Transaction) => {
  if (filter.accountId) {
    return (
      t.sourceWalletId === filter.accountId ||
      t.destinationWalletId === filter.accountId
    );
  }

  // no filter
  return true;
};

const isTransactionTypeMatch = (filter: Filters, t: Transaction) => {
  if (filter.transactionType === 'DEBIT') {
    return t.amount > 0 && !t.destinationWalletId;
  }

  if (filter.transactionType === 'CREDIT') {
    return t.amount < 0 && !t.destinationWalletId;
  }
  // no filter
  return true;
};

export type UseFilteredTransactionsInput = Partial<Filters> & {};
const useFilteredTransactions = (input?: UseFilteredTransactionsInput) => {
  const transactions = useAppSelector((state) => state.transactions);
  const globalFilters = useAppSelector((state) => state.filters);
  const filters = {
    ...globalFilters,
    ...(input || {}),
  };

  const sortTransactionByDate = sortBy((transaction: Transaction) =>
    new Date(transaction.paidAt).getTime(),
  );
  const sortedTransactionsArray = reverse(
    sortTransactionByDate(
      Object.keys(transactions).map((key) => transactions[key]),
    ),
  );

  const filteredTransactions = sortedTransactionsArray.filter(
    allPass([
      partial(isSearchTermMatch, [filters]),
      partial(isDateRangeMatch, [filters]),
      partial(isAccountMatch, [filters]),
      partial(isTransactionTypeMatch, [filters]),
    ]),
  );

  const groupByDate = groupBy((transaction: Transaction) =>
    formatDate(transaction.paidAt, 'MMMM d yyyy'),
  );

  // Ramda's groupBy types its return as Partial<Record<string, Transaction[]>>
  // to account for arbitrary key access, but Object.entries only ever
  // iterates keys groupBy actually populated with a real array — so this
  // cast reflects the true runtime guarantee instead of introducing an
  // untestable `data ?? []` branch for a case that can't happen.
  const groupedByDate = groupByDate(filteredTransactions) as Record<
    string,
    Transaction[]
  >;
  const dailyFilteredTransactions = Object.entries(groupedByDate).map(
    ([day, data]) => ({ day, data }),
  );

  const sortByDay = sortBy(
    (countedWalletId: typeof dailyFilteredTransactions[number]) =>
      -new Date(countedWalletId.day).getTime(),
  );

  const sortedDailyTransactions = sortByDay(dailyFilteredTransactions);

  return {
    filteredTransactions,
    dailyFilteredTransactions: sortedDailyTransactions,
  };
};

export default useFilteredTransactions;
