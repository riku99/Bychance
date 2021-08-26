import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {Flash} from '~/types/store/flashes';

export const flashesAdapter = createEntityAdapter<Flash>({
  selectId: (flash) => flash.id,
  sortComparer: (a, b) =>
    new Date(b.createdAt) < new Date(a.createdAt) ? 1 : -1,
});

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
    removeFlashes: (state, action: PayloadAction<number[]>) => {
      flashesAdapter.removeMany(state, action.payload);
    },
    resetFlashes: () => flashesAdapter.getInitialState(),
    upsertFlashes: (state, action: PayloadAction<Flash[]>) => {
      flashesAdapter.upsertMany(state, action.payload);
    },
    updateFlash: (
      state,
      action: PayloadAction<{id: number; changes: Partial<Flash>}>,
    ) => {
      flashesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          ...action.payload.changes,
        },
      });
    },
  },
});

const selectors = flashesAdapter.getSelectors();

export const getAllFlashes = (state: RootState) => {
  return selectors.selectAll(state.flashesReducer);
};

export const selectFlashesByIds = (state: RootState, ids: number[]) => {
  return ids
    .map((i) => selectors.selectById(state.flashesReducer, i))
    .filter((f): f is Exclude<typeof f, undefined> => f !== undefined);
};

export const selectFlashesByUserId = (state: RootState, userId: string) => {
  const all = getAllFlashes(state);
  return all.filter((f) => f.userId === userId);
};

export const selectFlashesByUserIds = (state: RootState, userIds: string[]) => {
  return userIds.map((userId) => {
    const fl = getAllFlashes(state).filter((f) => f.userId === userId);
    return fl;
  });
};

export const selectNotAllViewedUserIds = (
  state: RootState,
  userIds: string[],
) => {
  return selectFlashesByUserIds(state, userIds)
    .map((fs, idx) => {
      const v = fs.every((f) => f.viewerViewed);
      if (!v) {
        return userIds[idx];
      }
    })
    .filter((_f): _f is Exclude<typeof _f, undefined> => _f !== undefined);
};

export const flashesReducer = flashesSlice.reducer;

export const {
  setFlashes,
  resetFlashes,
  addFlash,
  removeFlash,
  upsertFlashes,
  removeFlashes,
  updateFlash,
} = flashesSlice.actions;
