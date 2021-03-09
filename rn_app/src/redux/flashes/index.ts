import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '../index';
import {createFlashThunk, deleteFlashThunk} from '../../actions/flashes';
import {
  firstLoginThunk,
  FirstLoginThunkPayload,
  //sampleLogin,
} from '../../actions/session/firstLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../actions/session/sessionLogin';
import {logoutAction} from '../../actions/sessions';

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  timestamp: string;
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
    [logoutAction.type]: () => flashesAdapter.getInitialState(),
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<FirstLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [createFlashThunk.fulfilled.type]: (state, action: PayloadAction<Flash>) =>
      flashesAdapter.addOne(state, action.payload),
    [deleteFlashThunk.fulfilled.type]: (state, action: PayloadAction<number>) =>
      flashesAdapter.removeOne(state, action.payload),
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const selectAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;
