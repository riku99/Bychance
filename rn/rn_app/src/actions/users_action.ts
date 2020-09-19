import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {
  sendIDtoken,
  sendAccessToken,
  sendNonce,
  sendEditedProfile,
} from '../api/users_api';

import {loginError} from '../redux/user';

const checkKeychain = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials || !credentials.password) {
    throw new Error('ログインできません。ログインしなおしてください');
  }
  const token = credentials.password;
  return token;
};

export const firstLoginAction = createAsyncThunk(
  'users/firstLogin',
  async ({}: Object, thunkAPI) => {
    try {
      const loginResult = await LineLogin.login({
        // @ts-ignore ドキュメント通りにやっても直らなかったのでignore
        scopes: ['openid', 'profile'],
      });
      const id_token = loginResult.accessToken.id_token;
      const access_token = loginResult.accessToken.access_token;
      const nonce = loginResult.IDTokenNonce;
      await sendNonce(nonce as string);
      const data = await sendIDtoken(id_token as string);
      await Keychain.resetGenericPassword();
      await Keychain.setGenericPassword('session', access_token as string);
      return data;
    } catch (e) {
      setTimeout(() => {
        thunkAPI.dispatch(firstLoginAction({}));
      }, 3000);
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

export const subsequentLoginAction = createAsyncThunk<
  Object,
  {keychainToken: string}
>('users/subsequentLogin', async ({keychainToken}, thunkAPI) => {
  try {
    const data = await sendAccessToken(keychainToken);
    return data;
  } catch (e) {
    setTimeout(() => {
      thunkAPI.dispatch(firstLoginAction({}));
    }, 3000);
    return thunkAPI.rejectWithValue(e.message);
  }
});

export const editProfileAction = createAsyncThunk(
  'users/editUser',
  async ({name, introduce}: {name: string; introduce: string}, thunkAPI) => {
    try {
      const token = await checkKeychain();
      const response = await sendEditedProfile({
        name: name,
        introduce: introduce,
        token: token,
      });
      if (response.type === 'invalid') {
        return thunkAPI.rejectWithValue(response.invalid);
      }
      return response as any;
    } catch (e) {
      setTimeout(() => {
        thunkAPI.dispatch(firstLoginAction({}));
      }, 2000);
      thunkAPI.dispatch(loginError(e.message));
    }
  },
);
export type editProfileActionType = ReturnType<typeof editProfileAction>;
