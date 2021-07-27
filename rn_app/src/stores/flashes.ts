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
import {
  createFlashThunk,
  CreateFlashThunkPaylaod,
} from '../thunks/flashes/createFlash';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
  //sampleLogin,
} from '../thunks/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../thunks/session/sessionLogin';
import {logoutThunk} from '~/thunks/session/logout';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '~/thunks/users/refreshUser';
import {refreshUser} from '~/stores/helpers/refreshUser';

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
      flashesAdapter.addMany(state, action.payload);
    },
  },
  extraReducers: {
    [logoutThunk.fulfilled.type]: () => flashesAdapter.getInitialState(),
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [createFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateFlashThunkPaylaod>,
    ) => flashesAdapter.addOne(state, action.payload.flash),
    [deleteFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<DeleteFlashThunkPayload>,
    ) => flashesAdapter.removeOne(state, action.payload),
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<RefreshUserThunkPaylaod>,
    ) => {
      refreshUser({slice: 'flash', state, action, adapter: flashesAdapter});
    },
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const selectAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;

export const {setFlashes} = flashesSlice.actions;
