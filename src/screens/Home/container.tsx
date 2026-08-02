import React from 'react';
import { useAppSelector } from 'store';

import { HomePrivateProps, HomePublicProps } from './props';
import HomeView from './view';

const HomeContainer = (props: HomePublicProps) => {
  const language = useAppSelector((state) => state.currency.language);
  const wallets = useAppSelector((state) => state.wallets);
  const transactions = useAppSelector((state) => state.transactions);

  const generatedProps: HomePrivateProps = {
    wallets,
    transactions,
    language,
  };

  return <HomeView {...props} {...generatedProps} />;
};

export default HomeContainer;
