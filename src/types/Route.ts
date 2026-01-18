export type MainStackParamList = {
  AUTH?: {};
  ONBOARDING?: {};
  MAIN?: {};
  TRANSACTIONS?: {};
  CREATE_WALLET?: {};
  EDIT_WALLET?: {
    walletId: string;
  };
  CREATE_TRANSACTION?: {};
  EDIT_TRANSACTION?: {
    transactionId: string;
  };
  WALLET_DETAILS?: {
    walletId: string;
  };
  TRANSACTION_DETAILS?: {
    transactionId: string;
  };
  SETTINGS?: {};
  FILTERS?: {};
  BUDGET?: {};
  ACCOUNTS?: {};
  DEBT_ANALYSIS?: {};
  ADD_VALUATION?: {
    walletId: string;
  };
};
