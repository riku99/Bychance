import axios, {AxiosError} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {createFlash} from '../apis/flashes';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {logout} from '../redux';

import {flashMessage} from '../helpers/flashMessage';

export const createFlashThunk = createAsyncThunk(
  'flashes/createFlash',
  async (
    {
      contentType,
      content,
      ext,
    }: {
      contentType: 'image' | 'video';
      content: string;
      ext: string | null;
    },
    thunkApi,
  ) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await createFlash({
        id: keychain.id,
        token: keychain.token,
        contentType,
        content,
        ext,
      });

      if (response.type === 'success') {
        return response.data;
      }

      if (response.type === 'loginError') {
        requestLogin(() => thunkApi.dispatch(logout()));
      }

      if (response.type === 'invalidError') {
        flashMessage('無効なデータです', 'danger');
      }

      if (response.type === 'someError') {
      }
    } else {
      requestLogin(() => thunkApi.dispatch(logout()));
    }
  },
);

// これまでは外部通信のロジックを別ファイルに分けていたがactionsに統一
export const deleteFlashThunk = createAsyncThunk(
  'flashes/delete',
  async ({flashId}: {flashId: number}, thunkApi) => {
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
          const axiosError = e as AxiosError<
            | {errorType: 'invalidError'; message: string}
            | {errorType: 'loginError'}
          >;
          if (axiosError.response?.data.errorType === 'loginError') {
            requestLogin(() => {
              console.log('logout');
            });
          } else if (axiosError.response?.data.errorType === 'invalidError') {
            flashMessage(axiosError.response?.data.message, 'danger');
          }
        }
      }
    } else {
      requestLogin(() => thunkApi.dispatch(logout()));
    }
  },
);
