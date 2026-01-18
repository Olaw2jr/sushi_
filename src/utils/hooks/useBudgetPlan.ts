import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { budgetEngine } from 'utils/budgetEngine';
import { useMemo } from 'react';

export const useBudgetPlan = (monthStr?: string) => {
  const categories = useSelector((state: RootState) => state.categories);
  const budgets = useSelector((state: RootState) => state.budgets);
  const transactions = useSelector((state: RootState) => state.transactions);
  const wallets = useSelector((state: RootState) => state.wallets);

  const currentMonth = monthStr || new Date().toISOString().slice(0, 7);

  const plan = useMemo(() => {
    const categoryList = Object.values(categories.categories).map(c => ({
      id: c.id,
      name: c.name,
      groupId: c.groupId,
      isSystem: c.isSystem,
      target: c.target
    }));

    const assignmentList: { categoryId: string; month: string; amount: number }[] = [];
    Object.entries(budgets.months).forEach(([month, monthBudgets]) => {
      Object.entries(monthBudgets).forEach(([categoryId, amount]) => {
        assignmentList.push({ categoryId, month, amount: amount || 0 });
      });
    });

    const transactionList = Object.values(transactions).map(t => ({
      id: t.id,
      paidAt: t.paidAt,
      amount: t.amount || 0,
      categoryId: t.categoryId,
      sourceWalletId: t.sourceWalletId,
      destinationWalletId: t.destinationWalletId
    }));

    const walletMap = Object.values(wallets).reduce((acc, w) => {
      acc[w.id] = {
        id: w.id,
        onBudget: w.onBudget,
        initialAmount: w.initialAmount || 0
      };
      return acc;
    }, {} as Record<string, any>);

    return budgetEngine.calculate(
      currentMonth,
      categoryList,
      assignmentList,
      transactionList,
      walletMap
    );
  }, [currentMonth, categories, budgets, transactions, wallets]);

  return plan;
};

export default useBudgetPlan;
