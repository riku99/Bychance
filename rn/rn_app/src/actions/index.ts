import {createAsyncThunk} from '@reduxjs/toolkit';
import {firstLoginThunk} from './users';

export const loginErrorThunk = createAsyncThunk(
  'index/loginError',
  async (dummy: undefined, thunkAPI) => {
    thunkAPI.dispatch(firstLoginThunk());
    return;
  },
);
