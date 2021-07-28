import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {logoutThunk} from '~/thunks/session/logout';

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
    [logoutThunk.fulfilled.type]: () => initialState,
  },
});

export const sessionReducer = sessionSlice.reducer;

export const {setLogin} = sessionSlice.actions;
