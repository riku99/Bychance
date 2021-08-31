import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Settings} from '~/types/store/settings';

const initialState: Settings = {};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSetitngs: (state, action: PayloadAction<Settings>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const settingsReducer = settingsSlice.reducer;

export const {setSetitngs} = settingsSlice.actions;
