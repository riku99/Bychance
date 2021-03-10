import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from './types';
import {logoutAction} from './session/logout';
import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {Flash} from '../redux/flashes';

export const createFlashThunk = createAsyncThunk<
  Flash,
  {sourceType: 'image' | 'video'; source: string; ext: string | null},
  {
    rejectValue: rejectPayload;
  }
>('flashes/createFlash', async ({sourceType, source, ext}, thunkApi) => {
  const keychain = await checkKeychain();

  if (keychain) {
    try {
      const response = await axios.post<Flash>(
        `${origin}/flashes`,
        {id: keychain.id, source, sourceType, ext},
        headers(keychain.token),
      );

      return response.data;
    } catch (e) {
      if (e && e.response) {
        const axiosError = e as basicAxiosError;
        if (axiosError.response?.data.errorType === 'loginError') {
          requestLogin(() => {
            thunkApi.dispatch(logoutAction);
          });
          return thunkApi.rejectWithValue({
            errorType: 'loginError',
          });
        } else if (axiosError.response?.data.errorType === 'invalidError') {
          return thunkApi.rejectWithValue({
            errorType: 'invalidError',
            message: axiosError.response.data.message,
          });
        } else {
          return thunkApi.rejectWithValue({errorType: 'someError'});
        }
      } else {
        return thunkApi.rejectWithValue({errorType: 'someError'});
      }
    }
  } else {
    requestLogin(() => thunkApi.dispatch(logoutAction));
  }
  return thunkApi.rejectWithValue({
    errorType: 'loginError',
  });
});

// これまでは外部通信のロジックを別ファイルに分けていたが、意味ないしむしろ記述量が倍になるのでactionsに統一
// また、これまではactions内でreturnによって何かのロジックを実装していたことがあったが、ここから基本的にthunk内ではアクションのリターン、dispatchのみ行うようにする
export const deleteFlashThunk = createAsyncThunk<
  number,
  {flashId: number},
  {
    rejectValue: rejectPayload;
  }
>('flashes/delete', async ({flashId}, thunkApi) => {
  const keychain = await checkKeychain();

  if (keychain) {
    try {
      await axios.request<{success: true}>({
        method: 'delete',
        url: `${origin}/flashes`,
        data: {id: keychain.id, flashId},
        ...headers(keychain.token),
      });
      return flashId;
    } catch (e) {
      if (e && e.response) {
        const axiosError = e as basicAxiosError;
        if (axiosError.response?.data.errorType === 'loginError') {
          requestLogin(() => {
            thunkApi.dispatch(logoutAction);
          });
          return thunkApi.rejectWithValue({
            errorType: 'loginError',
          });
        } else if (axiosError.response?.data.errorType === 'invalidError') {
          return thunkApi.rejectWithValue({
            errorType: 'invalidError',
            message: axiosError.response?.data.message,
          });
        } else {
          return thunkApi.rejectWithValue({errorType: 'someError'});
        }
      } else {
        return thunkApi.rejectWithValue({errorType: 'someError'});
      }
    }
  } else {
    requestLogin(() => thunkApi.dispatch(logoutAction));
    return thunkApi.rejectWithValue({
      errorType: 'loginError',
    });
  }
});

export const createAlreadyViewdFlashThunk = createAsyncThunk<
  {userId: number; flashId: number},
  {flashId: number; userId: number},
  {
    rejectValue: rejectPayload;
  }
>('flashes/createAlreadyViewdFlash', async ({flashId, userId}, thunkApi) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.post(
        `${origin}/user_flash_viewing`,
        {id: credentials.id, flashId},
        headers(credentials.token),
      );

      return {userId, flashId};
    } catch (e) {
      if (e && e.response) {
        const axiosError = e as basicAxiosError;
        if (axiosError.response?.data.errorType === 'loginError') {
          requestLogin(() => {
            thunkApi.dispatch(logoutAction);
          });
          return thunkApi.rejectWithValue({
            errorType: 'loginError',
          });
        } else if (axiosError.response?.data.errorType === 'invalidError') {
          return thunkApi.rejectWithValue({
            errorType: 'invalidError',
            message: axiosError.response?.data.message,
          });
        } else {
          return thunkApi.rejectWithValue({errorType: 'someError'});
        }
      } else {
        return thunkApi.rejectWithValue({errorType: 'someError'});
      }
    }
  } else {
    requestLogin(() => thunkApi.dispatch(logoutAction));
    return thunkApi.rejectWithValue({
      errorType: 'loginError',
    });
  }
});
