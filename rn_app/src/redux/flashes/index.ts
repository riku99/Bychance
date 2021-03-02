import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '../index';
import {createFlashThunk, deleteFlashThunk} from '../../actions/flashes';
import {
  subsequentLoginThunk,
  firstLoginThunk,
  //sampleLogin,
} from '../../actions/users';
import {logoutAction} from '../../actions/sessions';
import {SuccessfullLoginData} from '../../apis/usersApi';

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
    [subsequentLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
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
