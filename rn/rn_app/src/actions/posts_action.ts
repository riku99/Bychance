import {createAsyncThunk} from '@reduxjs/toolkit';

import {sendPost} from '../apis/posts_api';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {loginError} from '../redux/user';
import {firstLoginAction} from './users_action';

export type createPostType = {text: string; image: string};
export const createPostAction = createAsyncThunk(
  'posts/createPost',
  async (data: createPostType, thunkAPI) => {
    try {
      const token = await checkKeychain();

      if (!token) {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginAction());
        };
        requestLogin(callback);
        return;
      }

      const response = await sendPost(data, token);

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginAction());
        };
        requestLogin(callback);
        return;
      }

      if (response.type === 'invalid') {
        return thunkAPI.rejectWithValue(response.invalid);
      }

      if (response.type === 'someError') {
        throw new Error('不明なエラー');
      }

      return {id: response.id, text: response.text, image: response.image};
    } catch (e) {
      console.log(e.message);
      alertSomeError();
    }
  },
);
