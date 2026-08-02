import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Wallet } from 'store/wallets';
import { RootStackParamList } from 'types/Route';

export interface EditWalletPublicProps
  extends NativeStackScreenProps<RootStackParamList, 'EDIT_WALLET'> {}

export interface EditWalletPrivateProps {
  wallet: Wallet;
  editWallet: (payload: Wallet) => void;
}

export interface EditWalletProps
  extends EditWalletPublicProps,
    EditWalletPrivateProps {}
