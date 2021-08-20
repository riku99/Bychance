import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  userId: string;
  viewed: {userId: string}[];
};

export const flashesAdapter = createEntityAdapter<Flash>({
  selectId: (flash) => flash.id,
  sortComparer: (a, b) =>
    new Date(b.createdAt) < new Date(a.createdAt) ? 1 : -1,
});

export type FlashesAdapter = typeof flashesAdapter;

export type FlashesState = ReturnType<typeof flashesAdapter.getInitialState>;

const flashesSlice = createSlice({
  name: 'flashes',
  initialState: flashesAdapter.getInitialState(),
  reducers: {
    setFlashes: (state, action: PayloadAction<Flash[]>) => {
      flashesAdapter.setMany(state, action.payload);
    },
    addFlash: (state, action: PayloadAction<Flash>) => {
      flashesAdapter.addOne(state, action.payload);
    },
    removeFlash: (state, action: PayloadAction<number>) => {
      flashesAdapter.removeOne(state, action.payload);
    },
    resetFlashes: () => flashesAdapter.getInitialState(),
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const getAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;

export const {
  setFlashes,
  resetFlashes,
  addFlash,
  removeFlash,
} = flashesSlice.actions;
