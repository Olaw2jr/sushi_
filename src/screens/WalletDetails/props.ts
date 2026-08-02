import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Transactions } from 'store/transactions';
import { Wallet, Wallets } from 'store/wallets';
import { RootStackParamList } from 'types/Route';

export interface WalletDetailsPublicProps
  extends NativeStackScreenProps<RootStackParamList, 'WALLET_DETAILS'> {}

export interface WalletDetailsPrivateProps {
  wallet: Wallet;
  wallets: Wallets;
  transactions: Transactions;
  deleteWallet: () => void;
  language: string;
}

export interface WalletDetailsProps
  extends WalletDetailsPublicProps,
    WalletDetailsPrivateProps {}
