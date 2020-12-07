import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {logout, RootState} from './index';
import {createFlashThunk} from '../actions/flashes';
import {
  subsequentLoginAction,
  //firstLoginThunk,
  //sampleLogin,
} from '../actions/users';
import {SuccessfullLoginData} from '../apis/usersApi';

export type Flash = {
  id: number;
  content: string;
  contentType: 'image' | 'video';
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
    'index/logout': () => flashesAdapter.getInitialState(),
    [subsequentLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [createFlashThunk.fulfilled.type]: (state, action: PayloadAction<Flash>) =>
      flashesAdapter.addOne(state, action.payload),
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const selectAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;
