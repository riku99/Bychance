import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '../index';
import {
  deleteFlashThunk,
  DeleteFlashThunkPayload,
} from '../../apis/flashes/deleteFlash';
import {
  createFlashThunk,
  CreateFlashThunkPaylaod,
} from '../../apis/flashes/createFlash';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
  //sampleLogin,
} from '../../apis/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../apis/session/sessionLogin';
import {logoutThunk} from '~/apis/session/logout';

type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai';

type FlashStampData = Record<
  StampValues,
  {
    number: number;
    userIds: string[];
  }
>;

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  timestamp: string;
  viewsNumber: number;
  stamps: FlashStampData;
};

const flashesAdapter = createEntityAdapter<Flash>({
  selectId: (flash) => flash.id,
  sortComparer: (a, b) =>
    new Date(b.timestamp) < new Date(a.timestamp) ? 1 : -1,
});

const flashesSlice = createSlice({
  name: 'flashes',
  initialState: flashesAdapter.getInitialState(),
  reducers: {},
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
    ) => flashesAdapter.addOne(state, action.payload),
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
