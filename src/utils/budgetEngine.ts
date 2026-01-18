import { startOfMonth, endOfMonth, addMonths, parseISO, differenceInMonths } from 'date-fns';
import { TargetType, TargetCadence } from 'constants/enums';

export interface CategoryTarget {
  id: string;
  type: TargetType;
  amount: number;
  cadence: TargetCadence;
  targetDate?: string | null;
  weeklyDay?: number | null;
  isPaused: boolean;
}

export interface Category {
  id: string;
  name: string;
  groupId: string;
  isSystem: boolean;
  target: CategoryTarget | null;
}

export interface Assignment {
  categoryId: string;
  month: string; // YYYY-MM
  amount: number;
}

export interface Transaction {
  id: string;
  paidAt: string;
  amount: number;
  categoryId: string | null;
  sourceWalletId: string;
  destinationWalletId: string | null;
}

export interface Wallet {
  id: string;
  onBudget: boolean;
  initialAmount: number;
}

export interface BudgetPlanResult {
  categories: {
    id: string;
    name: string;
    groupId: string;
    assigned: number;
    activity: number;
    available: number;
    rollover: number;
    underfunded: number;
    target: CategoryTarget | null;
  }[];
  rtaAmount: number;
}

export class BudgetEngine {
  calculate(
    targetMonthStr: string,
    categories: Category[],
    assignments: Assignment[],
    transactions: Transaction[],
    wallets: Record<string, Wallet>
  ): BudgetPlanResult {
    const targetMonth = parseISO(targetMonthStr + '-01');
    const targetMonthStart = startOfMonth(targetMonth);
    
    // 1. Identify on-budget transactions
    const onBudgetTransactions = transactions.filter(t => {
      const sourceOnBudget = wallets[t.sourceWalletId]?.onBudget;
      const destOnBudget = t.destinationWalletId ? wallets[t.destinationWalletId]?.onBudget : false;
      
      // If it's a transfer between two on-budget accounts, it doesn't affect total budget availability
      if (sourceOnBudget && destOnBudget) return false;
      
      return sourceOnBudget || destOnBudget;
    });

    // Initialize tracking
    const categoryBalances = new Map<string, number>();
    let rtaBalance = Object.values(wallets)
      .filter(w => w.onBudget)
      .reduce((sum, w) => sum + (w.initialAmount || 0), 0);

    // Sort transactions by date
    const sortedTx = [...onBudgetTransactions].sort((a, b) => 
      new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()
    );

    const firstTxDate = sortedTx.length > 0 ? parseISO(sortedTx[0].paidAt) : new Date();
    let currentIterMonth = startOfMonth(firstTxDate);
    
    // Iterate from first transaction month to target month
    while (currentIterMonth <= targetMonthStart) {
      const iterMonthStr = currentIterMonth.toISOString().slice(0, 7);
      const iterMonthEnd = endOfMonth(currentIterMonth);
      const currentTime = currentIterMonth.getTime();

      // A. Income to RTA
      const monthlyIncome = sortedTx
        .filter(t => {
          const tDate = parseISO(t.paidAt);
          const tMonthStart = startOfMonth(tDate);
          const isThisMonth = tMonthStart.getTime() === currentTime;
          
          if (!isThisMonth) return false;

          const sourceOnBudget = wallets[t.sourceWalletId]?.onBudget;
          const destOnBudget = t.destinationWalletId ? wallets[t.destinationWalletId]?.onBudget : false;

          if (!t.destinationWalletId && t.amount > 0 && (t.categoryId === null || t.categoryId === 'rta')) {
             return true;
          }
          if (!sourceOnBudget && destOnBudget) return true; // Transfer in from off-budget
          
          return false;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      rtaBalance += monthlyIncome;

      // B. Process Categories
      for (const category of categories) {
        if (category.isSystem) continue;

        const monthlyAssigned = assignments
          .filter(a => a.categoryId === category.id && a.month === iterMonthStr)
          .reduce((sum, a) => sum + (a.amount || 0), 0);

        const monthlyActivity = sortedTx
          .filter(t => {
            const tDate = parseISO(t.paidAt);
            if (tDate < currentIterMonth || tDate > iterMonthEnd) return false;
            return t.categoryId === category.id;
          })
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        const prevAvailable = categoryBalances.get(category.id) || 0;
        const available = prevAvailable + monthlyAssigned + monthlyActivity;

        rtaBalance -= monthlyAssigned;
        categoryBalances.set(category.id, available);
      }

      // C. Overspending Rule
      if (currentIterMonth < targetMonthStart) {
        for (const category of categories) {
          const balance = categoryBalances.get(category.id) || 0;
          if (balance < 0) {
            rtaBalance += balance;
            categoryBalances.set(category.id, 0);
          }
        }
      }

      currentIterMonth = addMonths(currentIterMonth, 1);
    }

    // Final mapping for target month
    const iterMonthStr = targetMonthStart.toISOString().slice(0, 7);
    const resultCategories = categories.filter(c => !c.isSystem).map(category => {
      const available = categoryBalances.get(category.id) || 0;
      
      const assigned = assignments
        .filter(a => a.categoryId === category.id && a.month === iterMonthStr)
        .reduce((sum, a) => sum + a.amount, 0);

      const activity = sortedTx
        .filter(t => {
          const tDate = parseISO(t.paidAt);
          return startOfMonth(tDate).getTime() === targetMonthStart.getTime() && t.categoryId === category.id;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const rollover = available - assigned - activity;
      
      // Underfunded calculation
      let underfunded = 0;
      if (category.target && !category.target.isPaused) {
        const amount = category.target.amount || 0;
        const { type, targetDate } = category.target;
        
        if (targetDate) {
          const tDate = parseISO(targetDate);
          const tMonthStart = startOfMonth(tDate);
          if (targetMonthStart <= tMonthStart) {
            const monthsRemaining = differenceInMonths(tMonthStart, targetMonthStart) + 1;
            const availableBeforeAssigned = available - (assigned || 0);
            const remainingToGoal = amount - availableBeforeAssigned;
            if (remainingToGoal > 0) {
              const amountThisMonth = remainingToGoal / monthsRemaining;
              underfunded = Math.max(0, amountThisMonth - (assigned || 0));
            }
          }
        } else {
          // Monthly targets
          if (type === TargetType.REFILL || type === TargetType.BALANCE) {
            const availableBeforeSpending = available - (activity || 0);
            underfunded = Math.max(0, amount - availableBeforeSpending);
          } else {
            underfunded = Math.max(0, amount - (assigned || 0));
          }
        }
      }

      return {
        id: category.id,
        name: category.name,
        groupId: category.groupId,
        assigned,
        activity,
        available,
        rollover,
        underfunded,
        target: category.target
      };
    });

    return {
      categories: resultCategories,
      rtaAmount: rtaBalance
    };
  }
}

export const budgetEngine = new BudgetEngine();
