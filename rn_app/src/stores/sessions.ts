import {createSlice} from '@reduxjs/toolkit';

import {lineLoginThunk} from '../thunks/session/lineLogin';
import {sessionLoginThunk} from '../thunks/session/sessionLogin';
import {logoutThunk} from '~/thunks/session/logout';
import {sampleLogin} from '../thunks/session/sampleLogin';

type initialState = {login: boolean};

const initialState: initialState = {login: false};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: () => ({login: true}),
    [lineLoginThunk.fulfilled.type]: () => ({login: true}),
    [sessionLoginThunk.fulfilled.type]: () => ({login: true}),
    [logoutThunk.fulfilled.type]: () => initialState,
  },
});

export const sessionReducer = sessionSlice.reducer;
