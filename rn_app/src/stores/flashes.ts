import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {
  deleteFlashThunk,
  DeleteFlashThunkPayload,
} from '../thunks/flashes/deleteFlash';

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  timestamp: string;
  viewsNumber: number;
};

export const flashesAdapter = createEntityAdapter<Flash>({
  selectId: (flash) => flash.id,
  sortComparer: (a, b) =>
    new Date(b.timestamp) < new Date(a.timestamp) ? 1 : -1,
});

export type FlashesAdapter = typeof flashesAdapter;

export type FlashesState = ReturnType<typeof flashesAdapter.getInitialState>;

const flashesSlice = createSlice({
  name: 'flashes',
  initialState: flashesAdapter.getInitialState(),
  reducers: {
    setFlashes: (state, action: PayloadAction<Flash[]>) => {
      flashesAdapter.upsertMany(state, action.payload);
    },
    addFlash: (state, action: PayloadAction<Flash>) => {
      flashesAdapter.addOne(state, action.payload);
    },
    resetFlashes: () => flashesAdapter.getInitialState(),
  },
  extraReducers: {
    [deleteFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<DeleteFlashThunkPayload>,
    ) => flashesAdapter.removeOne(state, action.payload),
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const selectAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;

export const {setFlashes, resetFlashes, addFlash} = flashesSlice.actions;
