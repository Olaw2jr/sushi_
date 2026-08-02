import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Transaction } from 'store/transactions';
import { Wallet } from 'store/wallets';
import { RootStackParamList } from 'types/Route';

export interface TransactionDetailsPublicProps
  extends NativeStackScreenProps<RootStackParamList, 'TRANSACTION_DETAILS'> {}

export interface TransactionDetailsPrivateProps {
  sourceWallet: Wallet;
  destinationWallet: Wallet | null;
  transaction: Transaction;
  deleteTransaction: () => void;
  language: string;
}

export interface TransactionDetailsProps
  extends TransactionDetailsPublicProps,
    TransactionDetailsPrivateProps {}
