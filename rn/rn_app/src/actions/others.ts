import {createAsyncThunk} from '@reduxjs/toolkit';

import {getOthers} from '../apis/others_api';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {loginErrorThunk} from './index';

export const getOthersThunk = createAsyncThunk(
  'others/getOthersThunk',
  async (dummy: undefined, thunkAPI) => {
    try {
      const keychain = await checkKeychain();
      if (keychain) {
        const response = await getOthers(keychain);

        if (response.type === 'success') {
          return response.others;
        }

        if (response.type === 'loginError') {
          const callback = () => {
            thunkAPI.dispatch(loginErrorThunk());
          };
          requestLogin(callback);
          return thunkAPI.rejectWithValue({loginError: true});
        }
      } else {
        const callback = () => {
          thunkAPI.dispatch(loginErrorThunk());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }
    } catch (e) {
      console.log(e.message);
      alertSomeError();
      return thunkAPI.rejectWithValue({someError: true});
    }
  },
);
