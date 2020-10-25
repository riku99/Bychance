import {createAsyncThunk} from '@reduxjs/toolkit';

import {getOthers} from '../apis/others_api';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {loginErrorThunk} from './index';

export const getOthersThunk = createAsyncThunk(
  'others/getOthersThunk',
  async ({lat, lng}: {lat: number | null; lng: number | null}, thunkAPI) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await getOthers({...keychain, lat, lng});

      if (response.type === 'success') {
        return response.data;
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginErrorThunk());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } else {
      const callback = () => {
        thunkAPI.dispatch(loginErrorThunk());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);
