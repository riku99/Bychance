import {createSlice} from '@reduxjs/toolkit';

import {firstLoginThunk} from '../../actions/session/firstLogin';
import {sessionLoginThunk} from '../../actions/session/sessionLogin';
import {logoutAction} from '../../actions/sessions';
import {sampleLogin} from '../../actions/session/sampleLogin';

type initialState = {login: boolean};

const initialState: initialState = {login: false};

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: () => ({login: true}),
    [firstLoginThunk.fulfilled.type]: () => ({login: true}),
    [sessionLoginThunk.fulfilled.type]: () => ({login: true}),
    [logoutAction.type]: () => initialState,
  },
});

export const sessionReducer = sessionSlice.reducer;
