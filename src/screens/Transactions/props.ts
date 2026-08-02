import { Transactions } from 'store/transactions';
import { Wallets } from 'store/wallets';
import { TabScreenProps } from 'types/Route';

export type TransactionFilter = {
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
  accountId: string | null;
};

export interface TransactionsPublicProps
  extends TabScreenProps<'TRANSACTIONS'> {}

export interface TransactionsPrivateProps {
  wallets: Wallets;
  transactions: Transactions;
  language: string;
}

export interface TransactionsProps
  extends TransactionsPublicProps,
    TransactionsPrivateProps {}
