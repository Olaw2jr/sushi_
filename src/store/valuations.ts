import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { v1 as uuidv1 } from 'uuid';

export type AssetValuation = {
  id: string;
  assetId: string;
  date: string;
  value: number | null;
  price: number | null;
  quantity: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetValuations = Record<string, AssetValuation>;

const initialState: AssetValuations = {};

const valuationsSlice = createSlice({
  name: 'valuations',
  initialState,
  reducers: {
    addValuation(state, action: PayloadAction<Omit<AssetValuation, 'id' | 'createdAt' | 'updatedAt'>>) {
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
    deleteValuation(state, action: PayloadAction<string>) {
      return produce(state, (draft) => {
        delete draft[action.payload];
      });
    },
  },
});

export const { addValuation, deleteValuation } = valuationsSlice.actions;
export default valuationsSlice.reducer;
