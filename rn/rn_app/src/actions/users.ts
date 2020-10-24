import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {
  sendIDtoken,
  sendAccessToken,
  sendNonce,
  sendEditedProfile,
  sendRequestToChangeDisplay,
} from '../apis/users_api';

import {checkKeychain, credentials} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {setPostsAction} from '../redux/post';
import {loginErrorThunk} from './index';
import {getCurrentPosition} from '../helpers/gelocation';

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

      const position = await getCurrentPosition();

      const response = await sendIDtoken({
        token: idToken as string,
        lat: position ? position.lat : null,
        lng: position ? position.lng : null,
      });

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
          thunkAPI.dispatch(loginErrorThunk());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } catch (e) {
      if (e.message === 'User cancelled or interrupted the login process.') {
        const callback = () => {
          thunkAPI.dispatch(loginErrorThunk());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({lineCancelled: true});
      }
    }
  },
);

export const subsequentLoginAction = createAsyncThunk(
  'users/subsequentLogin',
  async ({id, token}: credentials, thunkAPI) => {
    const response = await sendAccessToken({id, token});

    if (response.type === 'success') {
      thunkAPI.dispatch(setPostsAction(response.posts));
      return response.user;
    }
    if (response.type === 'loginError') {
      const callback = () => {
        thunkAPI.dispatch(loginErrorThunk());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }

    if (response.type === 'someError') {
      console.log(response.message);
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
      message,
    }: {
      name: string;
      introduce: string;
      image: string | undefined;
      message: string;
    },
    thunkAPI,
  ) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await sendEditedProfile({
        name: name,
        introduce: introduce,
        image: image,
        message: message,
        id: keychain.id,
        token: keychain.token,
      });
      if (response.type === 'success') {
        return response.user;
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

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } else {
      const callback = () => {
        thunkAPI.dispatch(loginErrorThunk());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

export const editUserDisplayThunk = createAsyncThunk(
  'users/editUserDisplay',
  async (display: boolean, thunkAPI) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await sendRequestToChangeDisplay({
        display,
        id: keychain.id,
        token: keychain.token,
      });

      if (response.type === 'success') {
        return display;
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(loginErrorThunk());
        };
        requestLogin(callback);
        return thunkAPI.rejectWithValue({loginError: true});
      }

      if (response.type === 'someError') {
        console.log(response.message);
        alertSomeError();
        return thunkAPI.rejectWithValue({someError: true});
      }
    } else {
      const callback = () => {
        thunkAPI.dispatch(loginErrorThunk());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);
