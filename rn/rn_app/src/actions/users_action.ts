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
import {checkKeychain} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {setPostsAction} from '../redux/post';

export const firstLoginAction = createAsyncThunk(
  'users/firstLogin',
  async ({}, thunkAPI) => {
    try {
      const loginResult = await LineLogin.login({
        // @ts-ignore ドキュメント通りにやっても直らなかったのでignore
        scopes: ['openid', 'profile'],
      });
      const idToken = loginResult.accessToken.id_token;
      const accessToken = loginResult.accessToken.access_token;
      const nonce = loginResult.IDTokenNonce;
      await sendNonce(nonce as string);
      const response = await sendIDtoken(idToken as string);

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginAction());
        };
        requestLogin(callback);
        return;
      }
      await Keychain.resetGenericPassword();
      await Keychain.setGenericPassword('session', accessToken as string);

      thunkAPI.dispatch(setPostsAction(response.posts));
      return response;
    } catch (e) {
      console.log(e.message);
      alertSomeError();
    }
  },
);

export const subsequentLoginAction = createAsyncThunk<
  Object,
  {keychainToken: string}
>('users/subsequentLogin', async ({keychainToken}, thunkAPI) => {
  try {
    const response = await sendAccessToken(keychainToken);
    if (response.type === 'loginError') {
      const callback = () => {
        thunkAPI.dispatch(loginError());
        thunkAPI.dispatch(firstLoginAction());
      };
      requestLogin(callback);
      return;
    }
    thunkAPI.dispatch(setPostsAction(response.posts));
    return response;
  } catch (e) {
    console.log(e.message);
    alertSomeError();
  }
});

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
      const token = await checkKeychain();
      if (!token) {
        const callback = () => {
          thunkAPI.dispatch(loginError());
          thunkAPI.dispatch(firstLoginAction());
        };
        requestLogin(callback);
        return;
      }
      const response = await sendEditedProfile({
        name: name,
        introduce: introduce,
        image: image,
        token: token,
      });

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
      return response;
    } catch (e) {
      console.log(e.message);
      alertSomeError();
    }
  },
);
