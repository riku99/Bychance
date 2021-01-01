import {createAsyncThunk} from '@reduxjs/toolkit';
import {showMessage} from 'react-native-flash-message';

import {sendPost, deletePost} from '../apis/postsApi';
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {logout} from '../redux/index';

export const createPostAction = createAsyncThunk(
  'posts/createPost',
  async ({text, image}: {text: string; image: string}, thunkAPI) => {
    const keychain = await checkKeychain();

    if (keychain) {
      const response = await sendPost({
        text,
        image,
        id: keychain.id,
        token: keychain.token,
      });
      if (response.type === 'success') {
        showMessage({
          message: '投稿しました',
          type: 'success',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return response.data;
      }
      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(logout());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'invalid') {
        showMessage({
          message: response.invalid,
          type: 'danger',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return thunkAPI.rejectWithValue({invalid: response.invalid});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } else {
      const callback = () => {
        thunkAPI.dispatch(logout());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

export const deletePostThunk = createAsyncThunk(
  'post/deletePost',
  async (id: number, thunkAPI) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await deletePost({
        postId: id,
        id: keychain.id,
        token: keychain.token,
      });

      if (response.type === 'success') {
        showMessage({
          message: '削除しました',
          type: 'success',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return id;
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(logout());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'invalid') {
        showMessage({
          message: response.invalid,
          type: 'danger',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return thunkAPI.rejectWithValue({invalid: response.invalid});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } else {
      const callback = () => {
        thunkAPI.dispatch(logout());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);
