import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateWalletInput } from 'store/wallets';
import { RootStackParamList } from 'types/Route';

export interface CreateWalletPublicProps
  extends NativeStackScreenProps<RootStackParamList, 'CREATE_WALLET'> {}

export interface CreateWalletPrivateProps {
  createWallet: (payload: CreateWalletInput) => void;
}

export interface CreateWalletProps
  extends CreateWalletPublicProps,
    CreateWalletPrivateProps {}
