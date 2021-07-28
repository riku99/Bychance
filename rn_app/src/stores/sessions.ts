import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {lineLoginThunk} from '../thunks/session/lineLogin';
import {logoutThunk} from '~/thunks/session/logout';
import {sampleLogin} from '../thunks/session/sampleLogin';

type initialState = {login: boolean};

const initialState: initialState = {login: false};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        return {
          login: true,
        };
      } else {
        return initialState;
      }
    },
  },
  extraReducers: {
    [sampleLogin.fulfilled.type]: () => ({login: true}),
    [lineLoginThunk.fulfilled.type]: () => ({login: true}),
    [logoutThunk.fulfilled.type]: () => initialState,
  },
});

export const sessionReducer = sessionSlice.reducer;

export const {setLogin} = sessionSlice.actions;
