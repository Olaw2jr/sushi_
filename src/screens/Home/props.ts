import { Transactions } from 'store/transactions';
import { Wallets } from 'store/wallets';
import { TabScreenProps } from 'types/Route';

export interface HomePublicProps extends TabScreenProps<'HOME'> {}

export interface HomePrivateProps {
  wallets: Wallets;
  transactions: Transactions;
  language: string;
}

export interface HomeProps extends HomePublicProps, HomePrivateProps {}
