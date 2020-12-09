import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from './d';
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
            thunkApi.dispatch(logout());
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
    requestLogin(() => thunkApi.dispatch(logout()));
    return thunkApi.rejectWithValue({
      errorType: 'loginError',
    });
  }
});
