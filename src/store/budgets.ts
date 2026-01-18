import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Month format: "YYYY-MM"
// CategoryId -> Assigned Amount
export type BudgetMonth = Record<string, number>;

export type BudgetsState = {
  // "2023-10": { "cat-123": 500 }
  months: Record<string, BudgetMonth>;
};

const currentMonth = new Date().toISOString().slice(0, 7);

const initialState: BudgetsState = {
  months: {
    [currentMonth]: {
      'cat-rent': 800000,
      'cat-utilities': 150000,
      'cat-transport': 200000,
      'cat-meals': 300000,
      'cat-groceries': 400000,
      'cat-personal': 100000,
      'cat-weekend': 200000,
      'cat-travel': 0,
      'cat-emergency': 200000,
      'cat-savings': 300000,
      'cat-investment': 500000,
    }
  },
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    assignMoney(state, action: PayloadAction<{ month: string; categoryId: string; amount: number }>) {
      const { month, categoryId, amount } = action.payload;
      if (!state.months[month]) {
        state.months[month] = {};
      }
      // Set the assigned amount (absolute value, or delta? YNAB usually lets you type the absolute assigned amount)
      state.months[month][categoryId] = amount;
    },
    moveMoney(state, action: PayloadAction<{ month: string; fromCategoryId: string; toCategoryId: string; amount: number }>) {
        const { month, fromCategoryId, toCategoryId, amount } = action.payload;
        if (!state.months[month]) state.months[month] = {};
        
        const fromCurrent = state.months[month][fromCategoryId] || 0;
        const toCurrent = state.months[month][toCategoryId] || 0;

        state.months[month][fromCategoryId] = fromCurrent - amount;
        state.months[month][toCategoryId] = toCurrent + amount;
    }
  },
});

export const { assignMoney, moveMoney } = budgetsSlice.actions;
export default budgetsSlice.reducer;
