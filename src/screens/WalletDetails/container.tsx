import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store';
import { deleteWalletAction } from 'store/wallets';

import { WalletDetailsPrivateProps, WalletDetailsPublicProps } from './props';
import WalletDetailsView from './view';

const WalletDetailsContainer = (props: WalletDetailsPublicProps) => {
  const dispatch = useDispatch();
  const walletId = props.route.params?.walletId || '';
  const language = useAppSelector((state) => state.currency.language);
  const wallets = useAppSelector((state) => state.wallets);
  const transactions = useAppSelector((state) => state.transactions);
  const wallet = wallets[walletId];

  if (!wallet) {
    props.navigation.goBack();
  }

  const deleteWallet = () => {
    dispatch(deleteWalletAction(wallet.id));
    props.navigation.goBack();
  };

  const generatedProps: WalletDetailsPrivateProps = {
    wallet,
    wallets,
    transactions,
    deleteWallet,
    language,
  };

  return <WalletDetailsView {...props} {...generatedProps} />;
};

export default WalletDetailsContainer;
