import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {logoutThunk} from '~/thunks/session/logout';

type BottomToast = {
  data?: {
    message: string;
    timestamp?: string;
    type: 'success' | 'normal' | 'danger';
  };
};

const initialState: BottomToast | undefined = {};

const bottomToastSlice = createSlice({
  name: 'bottomToast',
  initialState: initialState,
  reducers: {
    showBottomToast: (state, action: PayloadAction<BottomToast>) =>
      action.payload,
  },
  extraReducers: {
    [logoutThunk.fulfilled.type]: () => initialState,
  },
});

export const {showBottomToast} = bottomToastSlice.actions;

export const bottomToastReducer = bottomToastSlice.reducer;
