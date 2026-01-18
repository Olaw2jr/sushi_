import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { v1 as uuidv1 } from 'uuid';
import { deleteWalletAction } from './wallets';
import { TransactionStatus, TransactionKind, FlagColor } from 'constants/enums';

export type Transaction = {
  id: string;
  sourceWalletId: string;
  destinationWalletId: string | null;
  categoryId: string | null;
  entityId: string | null;
  category: string; // Keep for legacy/simple display
  payee: string; // Keep for legacy/simple display
  description: string;
  amount: number;
  cleared: TransactionStatus;
  kind: TransactionKind | null;
  flagColor: FlagColor | null;
  isTransfer: boolean;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
  unitPrice?: number;
};

export type CreateTransactionInput = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>;

export type Transactions = Record<string, Transaction>;

const currentMonth = new Date().toISOString().slice(0, 7);

const initialState: Transactions = {
  't-salary': {
    id: 't-salary',
    sourceWalletId: 'wallet-nmb',
    destinationWalletId: null,
    categoryId: 'cat-salary',
    entityId: 'ent-employer',
    category: 'Salary',
    payee: 'Employer Ltd',
    description: 'Monthly Salary',
    amount: 3500000,
    cleared: TransactionStatus.CLEARED,
    kind: TransactionKind.INCOME,
    flagColor: null,
    isTransfer: false,
    paidAt: `${currentMonth}-25T09:00:00.000Z`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  't-rent': {
    id: 't-rent',
    sourceWalletId: 'wallet-nmb',
    destinationWalletId: null,
    categoryId: 'cat-rent',
    entityId: 'ent-landlord',
    category: 'Rent',
    payee: 'Landlord',
    description: 'Monthly Rent',
    amount: -800000,
    cleared: TransactionStatus.CLEARED,
    kind: TransactionKind.PAYMENT,
    flagColor: FlagColor.RED,
    isTransfer: false,
    paidAt: `${currentMonth}-01T10:00:00.000Z`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  't-luku': {
    id: 't-luku',
    sourceWalletId: 'wallet-mpesa',
    destinationWalletId: null,
    categoryId: 'cat-utilities',
    entityId: 'ent-tanesco',
    category: 'Utilities (LUKU/Water)',
    payee: 'TANESCO',
    description: 'Electricity Tokens',
    amount: -50000,
    cleared: TransactionStatus.CLEARED,
    kind: TransactionKind.BILL_PAYMENT,
    flagColor: null,
    isTransfer: false,
    paidAt: `${currentMonth}-02T14:30:00.000Z`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  't-savings-move': {
    id: 't-savings-move',
    sourceWalletId: 'wallet-nmb',
    destinationWalletId: 'wallet-selcom',
    categoryId: 'cat-savings',
    entityId: null,
    category: 'Savings',
    payee: 'Self',
    description: 'Transfer to savings',
    amount: -500000,
    cleared: TransactionStatus.CLEARED,
    kind: TransactionKind.TRANSFER,
    flagColor: FlagColor.BLUE,
    isTransfer: true,
    paidAt: `${currentMonth}-26T10:00:00.000Z`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    createTransaction(state, action: PayloadAction<CreateTransactionInput>) {
      return produce(state, (draft) => {
        const id = uuidv1();
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        draft[id] = {
          id,
          createdAt,
          updatedAt,
          ...action.payload,
        };
      });
    },
    editTransaction(state, action: PayloadAction<Transaction>) {
      return produce(state, (draft) => {
        const updatedAt = new Date().toISOString();
        draft[action.payload.id] = {
          ...action.payload,
          updatedAt,
        };
      });
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      return produce(state, (draft) => {
        const id = action.payload;
        delete draft[id];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteWalletAction, (state, action) => {
      return produce(state, (draft) => {
        const walletId = action.payload;
        const transactionIds = Object.keys(draft).filter(
          (key) =>
            draft[key].sourceWalletId === walletId ||
            draft[key].destinationWalletId === walletId,
        );
        transactionIds.forEach((transactionId) => {
          delete draft[transactionId];
        });
      });
    });
  },
});

export const {
  createTransaction: createTransactionAction,
  editTransaction: editTransactionAction,
  deleteTransaction: deleteTransactionAction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
