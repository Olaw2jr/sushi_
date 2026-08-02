import React from 'react';
import { useAppSelector } from 'store';

import { TransactionsPrivateProps, TransactionsPublicProps } from './props';
import TransactionsView from './view';

const TransactionsContainer = (props: TransactionsPublicProps) => {
  const wallets = useAppSelector((state) => state.wallets);

  const language = useAppSelector((state) => state.currency.language);
  const transactions = useAppSelector((state) => state.transactions);

  const generatedProps: TransactionsPrivateProps = {
    wallets,
    transactions,
    language,
  };

  return <TransactionsView {...props} {...generatedProps} />;
};

export default TransactionsContainer;
