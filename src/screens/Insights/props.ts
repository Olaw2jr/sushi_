import { Transactions } from 'store/transactions';
import { Wallets } from 'store/wallets';
import { TabScreenProps } from 'types/Route';

export type TransactionFilter = {
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
};

export interface InsightsPublicProps extends TabScreenProps<'INSIGHTS'> {}

export interface InsightsPrivateProps {
  wallets: Wallets;
  transactions: Transactions;
  language: string;
}

export interface InsightsProps
  extends InsightsPublicProps,
    InsightsPrivateProps {}
