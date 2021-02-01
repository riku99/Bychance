import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from './d';
import {logoutAction} from './sessions';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {AnotherUser} from '../components/users/SearchUsers';
import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';

export const getOthersThunk = createAsyncThunk<
  AnotherUser[],
  {lat: number | null; lng: number | null; range: number},
  {
    rejectValue: rejectPayload;
  }
>('others/getOthersThunk', async ({lat, lng, range}, thunkAPI) => {
  const keychain = await checkKeychain();

  if (keychain) {
    try {
      const response = await axios.get<AnotherUser[]>(`${origin}/others`, {
        params: {id: keychain.id, lat, lng, range},
        ...headers(keychain.token),
      });

      return response.data;
    } catch (e) {
      if (e && e.response) {
        const axiosError = e as basicAxiosError;

        switch (axiosError.response?.data.errorType) {
          case 'loginError':
            requestLogin(() => {
              thunkAPI.dispatch(logoutAction);
            });
            return thunkAPI.rejectWithValue({errorType: 'loginError'});
          default:
            alertSomeError();
            return thunkAPI.rejectWithValue({errorType: 'someError'});
        }
      } else {
        alertSomeError();
        return thunkAPI.rejectWithValue({errorType: 'someError'});
      }
    }
  } else {
    requestLogin(() => {
      thunkAPI.dispatch(logoutAction);
    });
    return thunkAPI.rejectWithValue({errorType: 'loginError'});
  }
});
