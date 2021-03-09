import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {Credentials} from '../helpers/keychain';
import {handleBasicError} from '../helpers/error';
import {rejectPayload, SuccessfullLoginData} from './types';

export const sampleLogin = createAsyncThunk('sample/login', async () => {
  const response = await axios.post<SuccessfullLoginData & {token: string}>(
    `${origin}/sample_login`,
  );
  await Keychain.resetGenericPassword();
  await Keychain.setGenericPassword(
    String(response.data.user.id),
    response.data.token,
  );
  return response.data;
});

export const firstLoginThunk = createAsyncThunk<
  SuccessfullLoginData | void,
  undefined,
  {rejectValue: rejectPayload}
>('users/firstLogin', async (dummy, {dispatch, rejectWithValue}) => {
  try {
    const loginResult = await LineLogin.login({
      // @ts-ignore ドキュメント通りにやっても直らなかったのでignore
      scopes: ['openid', 'profile'],
    });
    const idToken = loginResult.accessToken.id_token;
    const nonce = loginResult.IDTokenNonce;

    await axios.post(`${origin}/nonce`, {nonce});

    // firstログインで位置情報とる必要ある?
    // コンポーネントがマウントされたらで良くない?
    //const position = await getCurrentPosition();

    const response = await axios.post<SuccessfullLoginData & {token: string}>(
      `${origin}/first_login`,
      {},
      idToken && headers(idToken as string),
    );

    // 成功したらキーチェーンにcredentialsを保存
    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword(
      String(response.data.user.id),
      response.data.token,
    );

    const {token, ...restData} = response.data; // eslint-disable-line
    return restData;
  } catch (e) {
    if (e.message === 'User cancelled or interrupted the login process.') {
      console.log('cancelled');
    } else {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  }
});

export const subsequentLoginThunk = createAsyncThunk<
  SuccessfullLoginData,
  Credentials,
  {rejectValue: rejectPayload}
>('users/subsequentLogin', async ({id, token}, {dispatch, rejectWithValue}) => {
  try {
    const response = await axios.post<SuccessfullLoginData>(
      `${origin}/subsequent_login`,
      {id},
      headers(token),
    );

    return response.data;
  } catch (e) {
    const result = handleBasicError({e, dispatch});
    return rejectWithValue(result);
  }
});
