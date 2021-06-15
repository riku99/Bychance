import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type BottomToast = {
  data?: {
    message: string;
    timestamp: string;
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
});

export const {showBottomToast} = bottomToastSlice.actions;

export const bottomToastReducer = bottomToastSlice.reducer;
