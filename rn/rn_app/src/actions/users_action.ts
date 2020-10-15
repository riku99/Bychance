import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {
  sendIDtoken,
  sendAccessToken,
  sendNonce,
  sendEditedProfile,
} from '../apis/users_api';
import {loginError} from '../redux/user';
import {checkKeychain, credentials} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {setPostsAction} from '../redux/post';

export const firstLoginThunk = createAsyncThunk(
  'users/firstLogin',
  async (dummy: undefined, thunkAPI) => {
    try {
      const loginResult = await LineLogin.login({
        // @ts-ignore ドキュメント通りにやっても直らなかったのでignore
        scopes: ['openid', 'profile'],
      });
      const idToken = loginResult.accessToken.id_token;
      const nonce = loginResult.IDTokenNonce;
      await sendNonce(nonce as string);
      const response = await sendIDtoken(idToken as string);

      if (response.type === 'success') {
        await Keychain.resetGenericPassword();
        await Keychain.setGenericPassword(
          String(response.user.id),
          response.token,
        );
        thunkAPI.dispatch(setPostsAction(response.posts));
        return response.user;
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginThunk());
        };
        requestLogin(callback);
        return;
      }
    } catch (e) {
      if (e.message === 'User cancelled or interrupted the login process.') {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginThunk());
        };
        requestLogin(callback);
        return;
      }
      console.log(e.message);
      alertSomeError();
    }
  },
);

export const subsequentLoginAction = createAsyncThunk(
  'users/subsequentLogin',
  async ({id, token}: credentials, thunkAPI) => {
    try {
      const response = await sendAccessToken({id, token});

      if (response.type === 'success') {
        thunkAPI.dispatch(setPostsAction(response.posts));
        return response;
      }
      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginThunk());
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

export const editProfileAction = createAsyncThunk(
  'users/editUser',
  async (
    {
      name,
      introduce,
      image,
    }: {name: string; introduce: string; image: string | undefined},
    thunkAPI,
  ) => {
    try {
      const keychain = await checkKeychain();
      if (keychain) {
        const response = await sendEditedProfile({
          name: name,
          introduce: introduce,
          image: image,
          id: keychain.id,
          token: keychain.token,
        });
        if (response.type === 'user') {
          return response;
        }
        if (response.type === 'loginError') {
          const callback = () => {
            thunkAPI.dispatch(loginError());
            thunkAPI.dispatch(firstLoginThunk());
          };
          requestLogin(callback);
        }
        if (response.type === 'invalid') {
          return thunkAPI.rejectWithValue(response.invalid);
        }
      }
    } catch (e) {
      console.log(e.message);
      alertSomeError();
    }
  },
);
