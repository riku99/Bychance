import {createAsyncThunk} from '@reduxjs/toolkit';

import {createFlash} from '../apis/flashes';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {logout} from '../redux';
//import {logout} from '../redux/index';

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
