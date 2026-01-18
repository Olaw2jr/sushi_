import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useFilteredTransactions from './useFilteredTransactions';
import { AccountType } from 'constants/enums';

export const useFinancialOverview = () => {
  const wallets = useSelector((state: RootState) => state.wallets);
  const { filteredTransactions } = useFilteredTransactions();

  const walletsArray = Object.values(wallets);
  
  // Calculate Net Worth
  const totalInitialBalance = walletsArray.reduce((sum, wallet) => sum + wallet.initialAmount, 0);
  
  const balanceBreakdown = filteredTransactions.reduce(
    (accum, transaction) => {
      // ignore transfers on calculation
      if (!transaction.destinationWalletId) {
        if (transaction.amount > 0) {
          return {
            income: accum.income + Math.abs(transaction.amount),
            expenses: accum.expenses,
          };
        } else if (transaction.amount < 0) {
          return {
            income: accum.income,
            expenses: accum.expenses + Math.abs(transaction.amount),
          };
        }
      }
      return accum;
    },
    { income: 0, expenses: 0 }
  );

  const netWorth = totalInitialBalance + balanceBreakdown.income - balanceBreakdown.expenses;
  const monthlyCashFlow = balanceBreakdown.income - balanceBreakdown.expenses;
  const monthlyIncome = balanceBreakdown.income;

  // Calculate actual total debt from wallets
  const totalDebt = walletsArray
    .filter(w => w.type === AccountType.LOAN || w.type === AccountType.CREDIT_CARD)
    .reduce((sum, w) => {
      return sum + Math.abs(Math.min(w.initialAmount, 0)); 
    }, 0);

  const totalMonthlyDebtPayments = walletsArray
    .filter(w => w.type === AccountType.LOAN || w.type === AccountType.CREDIT_CARD)
    .reduce((sum, w) => {
      return sum + (w.nextPaymentAmount || 0);
    }, 0);

  const dti = monthlyIncome > 0 ? (totalMonthlyDebtPayments / monthlyIncome) * 100 : 0;

  // Mocked values for complex missing features
  const ageOfMoney = 42; 
  const portfolioPerformance = 8.5; 
  const savingsRate = balanceBreakdown.income > 0 
    ? ((balanceBreakdown.income - balanceBreakdown.expenses) / balanceBreakdown.income) * 100 
    : 0;

  return {
    netWorth,
    ageOfMoney,
    monthlyCashFlow,
    monthlyIncome,
    totalDebt,
    totalMonthlyDebtPayments,
    dti,
    portfolioPerformance,
    savingsRate,
  };
};

export default useFinancialOverview;
