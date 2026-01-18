import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { v1 as uuidv1 } from 'uuid';
import { EntityType } from 'constants/enums';

export type Entity = {
  id: string;
  name: string;
  logo: string | null;
  type: EntityType;
  code: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
};

export type Entities = Record<string, Entity>;

const initialState: Entities = {
  'ent-employer': {
    id: 'ent-employer',
    name: 'Employer Ltd',
    logo: null,
    type: EntityType.EMPLOYER,
    code: 'EMP001',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ent-landlord': {
    id: 'ent-landlord',
    name: 'Landlord',
    logo: null,
    type: EntityType.PERSON,
    code: null,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ent-tanesco': {
    id: 'ent-tanesco',
    name: 'TANESCO',
    logo: null,
    type: EntityType.UTILITY_COMPANY,
    code: 'UTIL001',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    createEntity(state, action: PayloadAction<Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>) {
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
    editEntity(state, action: PayloadAction<Entity>) {
      return produce(state, (draft) => {
        const updatedAt = new Date().toISOString();
        draft[action.payload.id] = {
          ...action.payload,
          updatedAt,
        };
      });
    },
    deleteEntity(state, action: PayloadAction<string>) {
      return produce(state, (draft) => {
        delete draft[action.payload];
      });
    },
  },
});

export const {
  createEntity: createEntityAction,
  editEntity: editEntityAction,
  deleteEntity: deleteEntityAction,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;
