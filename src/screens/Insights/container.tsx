import React from 'react';
import { useAppSelector } from 'store';

import { InsightsPrivateProps, InsightsPublicProps } from './props';
import InsightsView from './view';

const InsightsContainer = (props: InsightsPublicProps) => {
  const wallets = useAppSelector((state) => state.wallets);

  const language = useAppSelector((state) => state.currency.language);
  const transactions = useAppSelector((state) => state.transactions);

  const generatedProps: InsightsPrivateProps = {
    wallets,
    transactions,
    language,
  };

  return <InsightsView {...props} {...generatedProps} />;
};

export default InsightsContainer;
