import {createAsyncThunk} from '@reduxjs/toolkit';

import {sendPost, deletePost} from '../apis/posts_api';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {loginErrorThunk} from './index';

export const createPostAction = createAsyncThunk(
  'posts/createPost',
  async ({text, image}: {text: string; image: string}, thunkAPI) => {
    try {
      const keychain = await checkKeychain();

      if (keychain) {
        const response = await sendPost({
          text,
          image,
          user: keychain.id,
          token: keychain.token,
        });
        if (response.type === 'success') {
          return {
            id: response.id,
            text: response.text,
            image: response.image,
            date: response.date,
            userID: response.userID,
          };
        }
        if (response.type === 'loginError') {
          const callback = () => {
            thunkAPI.dispatch(loginErrorThunk());
          };
          requestLogin(callback);
          return thunkAPI.rejectWithValue({loginError: true});
        }

        if (response.type === 'invalid') {
          return thunkAPI.rejectWithValue({invalid: response.invalid});
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

export const deletePostAsync = createAsyncThunk(
  'post/deletePost',
  async (id: number, thunkAPI) => {
    try {
      const keychain = await checkKeychain();
      if (keychain) {
        const response = await deletePost({
          id,
          user: keychain.id,
          token: keychain.token,
        });

        if (response.type === 'success') {
          return id;
        }

        if (response.type === 'loginError') {
          const callback = () => {
            thunkAPI.dispatch(loginErrorThunk());
          };
          requestLogin(callback);
          return thunkAPI.rejectWithValue({loginError: true});
        }

        if (response.type === 'invalid') {
          return thunkAPI.rejectWithValue({invalid: response.invalid});
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
