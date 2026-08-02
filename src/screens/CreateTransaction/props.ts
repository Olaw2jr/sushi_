import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateTransactionInput, Transactions } from 'store/transactions';
import { Wallets } from 'store/wallets';
import { RootStackParamList } from 'types/Route';

export interface CreateTransactionPublicProps
  extends NativeStackScreenProps<RootStackParamList, 'CREATE_TRANSACTION'> {}

export interface CreateTransactionPrivateProps {
  wallets: Wallets;
  transactions: Transactions;
  createTransaction: (payload: CreateTransactionInput) => void;
}

export interface CreateTransactionProps
  extends CreateTransactionPublicProps,
    CreateTransactionPrivateProps {}
