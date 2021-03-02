import {createSlice} from '@reduxjs/toolkit';

import {
  firstLoginThunk,
  subsequentLoginThunk,
  sampleLogin,
} from '../../actions/users';
import {logoutAction} from '../../actions/sessions';

type initialState = {login: boolean};

const initialState: initialState = {login: false};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: () => ({login: true}),
    [firstLoginThunk.fulfilled.type]: () => ({login: true}),
    [subsequentLoginThunk.fulfilled.type]: () => ({login: true}),
    [logoutAction.type]: () => initialState,
  },
});

export const sessionReducer = sessionSlice.reducer;
