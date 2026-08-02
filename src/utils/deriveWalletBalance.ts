import { Transaction } from 'store/transactions';

export type WalletBalance = {
  balance: number;
  income: number;
  expenses: number;
};

// Pure function shared by Home (per-wallet balance in the accounts list)
// and WalletDetails (account balance + income/expense breakdown) — both
// screens used to compute this with slightly different, easy-to-drift
// inline reduces.
export const deriveWalletBalance = (
  walletId: string,
  initialAmount: number,
  transactions: Transaction[],
): WalletBalance => {
  const { income, expenses } = transactions.reduce(
    (accum, transaction) => {
      const isIncomingTransfer = transaction.destinationWalletId === walletId;
      const amount = isIncomingTransfer
        ? -transaction.amount
        : transaction.amount;

      if (amount > 0) {
        return { income: accum.income + amount, expenses: accum.expenses };
      }
      if (amount < 0) {
        return {
          income: accum.income,
          expenses: accum.expenses + Math.abs(amount),
        };
      }
      return accum;
    },
    { income: 0, expenses: 0 },
  );

  return { balance: initialAmount + income - expenses, income, expenses };
};
