import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TargetType, TargetCadence } from 'constants/enums';

export type CategoryTarget = {
  id: string;
  type: TargetType;
  amount: number;
  cadence: TargetCadence;
  targetDate?: string | null;
  weeklyDay?: number | null;
  isPaused: boolean;
};

export type CategoryGroup = {
  id: string;
  name: string;
  order: number;
  hidden: boolean;
};

export type Category = {
  id: string;
  groupId: string;
  name: string;
  order: number;
  hidden: boolean;
  isSystem: boolean;
  note: string | null;
  target: CategoryTarget | null;
  createdAt: string;
};

export type CategoriesState = {
  groups: Record<string, CategoryGroup>;
  categories: Record<string, Category>;
};

const initialState: CategoriesState = {
  groups: {
    'group-income': { id: 'group-income', name: 'Income', order: 0, hidden: false },
    'group-bills': { id: 'group-bills', name: 'Bills', order: 1, hidden: false },
    'group-needs': { id: 'group-needs', name: 'Needs', order: 2, hidden: false },
    'group-wants': { id: 'group-wants', name: 'Wants', order: 3, hidden: false },
    'group-investments': { id: 'group-investments', name: 'Investments', order: 4, hidden: false },
  },
  categories: {
    'cat-salary': { id: 'cat-salary', groupId: 'group-income', name: 'Salary', order: 0, hidden: false, isSystem: false, note: null, target: null, createdAt: new Date().toISOString() },
    'cat-rent': { 
      id: 'cat-rent', 
      groupId: 'group-bills', 
      name: 'Rent', 
      order: 0, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-rent',
        type: TargetType.REFILL,
        amount: 800000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      }, 
      createdAt: new Date().toISOString() 
    },
    'cat-utilities': { 
      id: 'cat-utilities', 
      groupId: 'group-bills', 
      name: 'Utilities (LUKU/Water)', 
      order: 1, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-util',
        type: TargetType.REFILL,
        amount: 150000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-transport': { 
      id: 'cat-transport', 
      groupId: 'group-needs', 
      name: 'Transport to Office', 
      order: 0, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-transp',
        type: TargetType.REFILL,
        amount: 200000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-meals': { 
      id: 'cat-meals', 
      groupId: 'group-needs', 
      name: 'Meals at Office', 
      order: 1, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-meals',
        type: TargetType.REFILL,
        amount: 300000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-groceries': { 
      id: 'cat-groceries', 
      groupId: 'group-needs', 
      name: 'Groceries', 
      order: 2, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-groc',
        type: TargetType.REFILL,
        amount: 400000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-personal': { 
      id: 'cat-personal', 
      groupId: 'group-needs', 
      name: 'Personal Care', 
      order: 3, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-pers',
        type: TargetType.REFILL,
        amount: 100000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-weekend': { 
      id: 'cat-weekend', 
      groupId: 'group-wants', 
      name: 'Weekends Day Out', 
      order: 0, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-wknd',
        type: TargetType.REFILL,
        amount: 200000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-travel': { 
      id: 'cat-travel', 
      groupId: 'group-wants', 
      name: 'Travel', 
      order: 1, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-trav',
        type: TargetType.SET_ASIDE,
        amount: 500000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-emergency': { 
      id: 'cat-emergency', 
      groupId: 'group-investments', 
      name: 'Emergency Fund', 
      order: 0, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-emer',
        type: TargetType.BALANCE,
        amount: 200000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-savings': { 
      id: 'cat-savings', 
      groupId: 'group-investments', 
      name: 'Savings', 
      order: 1, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-sav',
        type: TargetType.SET_ASIDE,
        amount: 300000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
    'cat-investment': { 
      id: 'cat-investment', 
      groupId: 'group-investments', 
      name: 'Investment', 
      order: 2, 
      hidden: false, 
      isSystem: false, 
      note: null, 
      target: {
        id: 'target-inv',
        type: TargetType.SET_ASIDE,
        amount: 500000,
        cadence: TargetCadence.MONTHLY,
        isPaused: false
      },
      createdAt: new Date().toISOString() 
    },
  }
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    createCategory(state, action: PayloadAction<{ name: string; groupId: string; target?: CategoryTarget | null }>) {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      state.categories[id] = {
        id,
        createdAt,
        order: Object.values(state.categories).filter(c => c.groupId === action.payload.groupId).length,
        hidden: false,
        isSystem: false,
        note: null,
        target: null,
        ...action.payload,
      };
    },
    updateCategory(state, action: PayloadAction<Partial<Category> & { id: string }>) {
      const { id, ...changes } = action.payload;
      if (state.categories[id]) {
        state.categories[id] = { ...state.categories[id], ...changes };
      }
    },
    setCategoryTarget(state, action: PayloadAction<{ categoryId: string; target: CategoryTarget | null }>) {
      const { categoryId, target } = action.payload;
      if (state.categories[categoryId]) {
        state.categories[categoryId].target = target;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      delete state.categories[action.payload];
    },
    createGroup(state, action: PayloadAction<{ name: string }>) {
      const id = uuidv4();
      state.groups[id] = { 
        id, 
        name: action.payload.name,
        order: Object.keys(state.groups).length,
        hidden: false
      };
    }
  },
});

export const { createCategory, updateCategory, deleteCategory, createGroup, setCategoryTarget } = categoriesSlice.actions;
export default categoriesSlice.reducer;