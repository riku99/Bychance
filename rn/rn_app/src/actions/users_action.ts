import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {sendIDtoken, sendAccessToken, sendNonce} from '../api/users_api';

// キーチェーンにアクセストークンがない場合のアクション
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

// キーチェーンにトークンがある場合のアクション
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
