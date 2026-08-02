import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  HOME: undefined;
  INSIGHTS: undefined;
  TRANSACTIONS: undefined;
  BUDGETS: undefined;
  SETTINGS: undefined;
};

export type RootStackParamList = {
  TABS: NavigatorScreenParams<TabParamList>;
  CREATE_WALLET: undefined;
  EDIT_WALLET: { walletId: string };
  CREATE_TRANSACTION: undefined;
  EDIT_TRANSACTION: { transactionId: string };
  WALLET_DETAILS: { walletId: string };
  TRANSACTION_DETAILS: { transactionId: string };
  FILTERS: undefined;
};

// Tab-root screens (Home, Insights, Transactions, Budgets, Settings) can
// navigate both to sibling tabs and to screens pushed on the enclosing
// root stack (e.g. WALLET_DETAILS, FILTERS) — this composite type gives
// them typed access to both instead of just their own tab navigator.
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
