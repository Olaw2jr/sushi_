import React from 'react';
import { ViewStyle } from 'react-native';
import TransactionCard from './view';
import { Transaction } from 'store/transactions';
import { Wallets } from 'store/wallets';
import { Theme } from 'store/theme';

type CreateListItemRendererInput = {
  wallets: Wallets;
  theme?: Theme;
  language: string;
  containerStyle?: ViewStyle;
  onPressItem: (transactionId: string) => void;
  showDescription?: boolean;
};

// Shared by Home, WalletDetails, and Transactions — all three rendered an
// identical (or near-identical) SectionList renderItem inline.
export const createListItemRenderer =
  ({
    wallets,
    theme,
    language,
    containerStyle,
    onPressItem,
    showDescription = false,
  }: CreateListItemRendererInput) =>
  ({ item: transaction }: { item: Transaction }) => {
    const sourceWallet = wallets[transaction.sourceWalletId];
    const destinationWallet = transaction.destinationWalletId
      ? wallets[transaction.destinationWalletId]
      : null;
    return (
      <TransactionCard
        containerStyle={containerStyle}
        key={transaction.id}
        category={transaction.category}
        description={showDescription ? transaction.description : undefined}
        amount={transaction.amount}
        sourceWallet={sourceWallet.label}
        destinationWallet={destinationWallet?.label}
        paidAt={transaction.paidAt}
        onPress={() => onPressItem(transaction.id)}
        theme={theme}
        language={language}
      />
    );
  };
