import {createAsyncThunk} from '@reduxjs/toolkit';

import {getOthers} from '../apis/others_api';
import {checkKeychain} from '../helpers/keychain';
import {loginError} from '../redux/user';
import {firstLoginAction} from './users_action';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';

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
            thunkAPI.dispatch(loginError());
            thunkAPI.dispatch(firstLoginAction());
          };
          requestLogin(callback);
        }
      } else {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginAction());
        };
        requestLogin(callback);
      }
    } catch (e) {
      console.log(e.message);
      alertSomeError();
    }
  },
);
