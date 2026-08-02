import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store';

import {
  TransactionDetailsPrivateProps,
  TransactionDetailsPublicProps,
} from './props';

import { deleteTransactionAction } from 'store/transactions';
import TransactionDetailsView from './view';

const TransactionDetailsContainer = (props: TransactionDetailsPublicProps) => {
  const dispatch = useDispatch();
  const transactionId = props.route.params?.transactionId || '';
  const language = useAppSelector((state) => state.currency.language);
  const wallets = useAppSelector((state) => state.wallets);
  const transactions = useAppSelector((state) => state.transactions);
  const transaction = transactions[transactionId];

  if (!transaction) {
    props.navigation.goBack();
  }

  const sourceWallet = wallets[transaction.sourceWalletId];
  const destinationWallet = transaction.destinationWalletId
    ? wallets[transaction.destinationWalletId]
    : null;

  const deleteTransaction = () => {
    dispatch(deleteTransactionAction(transaction.id));
    props.navigation.goBack();
  };
  const generatedProps: TransactionDetailsPrivateProps = {
    transaction,
    sourceWallet,
    destinationWallet,
    deleteTransaction,
    language,
  };

  return <TransactionDetailsView {...props} {...generatedProps} />;
};

export default TransactionDetailsContainer;
