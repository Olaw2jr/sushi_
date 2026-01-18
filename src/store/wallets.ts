import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { v1 as uuidv1 } from 'uuid';
import { AccountType } from 'constants/enums';

export type Wallet = {
  id: string;
  label: string;
  initialAmount: number;
  type: AccountType;
  onBudget: boolean;
  closed: boolean;
  note: string | null;
  parentId: string | null;
  entityId: string | null;
  
  // Ledger caches
  balance: number;
  outstandingBalance: number;
  availableCredit: number;
  remainingBalance: number;
  portfolioValue: number;
  
  // Details
  accountNumber: string | null;
  interestRate: number | null;
  nextPaymentDate: string | null;
  nextPaymentAmount: number | null;
  maturityDate: string | null;
  creditLimit: number;
  
  createdAt: string;
  updatedAt: string;
};

export type Wallets = Record<string, Wallet>;

export type CreateWalletInput = Omit<Wallet, 'id' | 'createdAt' | 'updatedAt' | 'closed' | 'balance' | 'outstandingBalance' | 'availableCredit' | 'remainingBalance' | 'portfolioValue'>;

const initialState: Wallets = {
  'wallet-nmb': {
    id: 'wallet-nmb',
    label: 'NMB Bank Current Account',
    initialAmount: 4500000,
    balance: 4500000,
    type: AccountType.CHECKING,
    onBudget: true,
    closed: false,
    note: null,
    parentId: null,
    entityId: 'ent-nmb', // Assuming we add this entity
    outstandingBalance: 0,
    availableCredit: 0,
    remainingBalance: 0,
    portfolioValue: 0,
    accountNumber: '123456789',
    interestRate: null,
    nextPaymentDate: null,
    nextPaymentAmount: null,
    maturityDate: null,
    creditLimit: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'wallet-selcom': {
    id: 'wallet-selcom',
    label: 'Selcom MF Current Account',
    initialAmount: 1200000,
    balance: 1200000,
    type: AccountType.CHECKING,
    onBudget: true,
    closed: false,
    note: null,
    parentId: null,
    entityId: null,
    outstandingBalance: 0,
    availableCredit: 0,
    remainingBalance: 0,
    portfolioValue: 0,
    accountNumber: null,
    interestRate: null,
    nextPaymentDate: null,
    nextPaymentAmount: null,
    maturityDate: null,
    creditLimit: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'wallet-mpesa': {
    id: 'wallet-mpesa',
    label: 'M-Pesa Mobile Money',
    initialAmount: 350000,
    balance: 350000,
    type: AccountType.MOBILE_MONEY,
    onBudget: true,
    closed: false,
    note: null,
    parentId: null,
    entityId: null,
    outstandingBalance: 0,
    availableCredit: 0,
    remainingBalance: 0,
    portfolioValue: 0,
    accountNumber: null,
    interestRate: null,
    nextPaymentDate: null,
    nextPaymentAmount: null,
    maturityDate: null,
    creditLimit: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'wallet-mixx': {
    id: 'wallet-mixx',
    label: 'Mixx by Yas Wallet',
    initialAmount: 150000,
    balance: 150000,
    type: AccountType.MOBILE_MONEY,
    onBudget: true,
    closed: false,
    note: null,
    parentId: null,
    entityId: null,
    outstandingBalance: 0,
    availableCredit: 0,
    remainingBalance: 0,
    portfolioValue: 0,
    accountNumber: null,
    interestRate: null,
    nextPaymentDate: null,
    nextPaymentAmount: null,
    maturityDate: null,
    creditLimit: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    createWallet(state, action: PayloadAction<CreateWalletInput>) {
      return produce(state, (draft) => {
        const id = uuidv1();
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        draft[id] = {
          id,
          createdAt,
          updatedAt,
          closed: false,
          balance: action.payload.initialAmount,
          outstandingBalance: 0,
          availableCredit: 0,
          remainingBalance: 0,
          portfolioValue: 0,
          ...action.payload,
        };
      });
    },
    editWallet(state, action: PayloadAction<Wallet>) {
      return produce(state, (draft) => {
        const updatedAt = new Date().toISOString();
        draft[action.payload.id] = {
          ...action.payload,
          updatedAt,
        };
      });
    },
    deleteWallet(state, action: PayloadAction<string>) {
      return produce(state, (draft) => {
        const id = action.payload;
        delete draft[id];
      });
    },
  },
});

export const {
  createWallet: createWalletAction,
  editWallet: editWalletAction,
  deleteWallet: deleteWalletAction,
} = walletsSlice.actions;

export default walletsSlice.reducer;