import {createAsyncThunk} from '@reduxjs/toolkit';

import {sendPost} from '../apis/posts_api';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {loginError} from '../redux/user';
import {firstLoginAction} from './users_action';

export const createPostAction = createAsyncThunk(
  'posts/createPost',
  async ({text, image}: {text: string; image: string}, thunkAPI) => {
    try {
      const keychain = await checkKeychain();

      if (keychain) {
        const response = await sendPost({
          text,
          image,
          id: keychain.id,
          token: keychain.token,
        });
        if (response.type === 'success') {
          return {
            id: response.id,
            text: response.text,
            image: response.image,
          };
        }
        if (response.type === 'loginError') {
          const callback = () => {
            thunkAPI.dispatch(loginError());
            thunkAPI.dispatch(firstLoginAction());
          };
          requestLogin(callback);
        }

        if (response.type === 'invalid') {
          thunkAPI.rejectWithValue(response.invalid);
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
