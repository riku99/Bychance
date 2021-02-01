import axios from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';

import {logoutAction} from './sessions';
import {
  sendRequestToChangeDisplay,
  sendPosition,
  sampleLoginApi,
} from '../apis/usersApi';
import {User} from '../redux/user';
import {origin} from '../constants/origin';
import {headers} from '../helpers/headers';
import {checkKeychain, Credentials} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError, handleBasicError} from '../helpers/error';
import {rejectPayload, SuccessfullLoginData} from './d';
import {AnotherUser} from '../components/others/SearchOthers';

export const sampleLogin = createAsyncThunk('sample/login', async () => {
  const response = await sampleLoginApi();
  await Keychain.resetGenericPassword();
  await Keychain.setGenericPassword(String(response.user.id), response.token);
  return response;
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

export const editProfileThunk = createAsyncThunk<
  Pick<User, 'id' | 'name' | 'introduce' | 'image' | 'message'>,
  {
    name: string;
    introduce: string;
    image: string | undefined;
    message: string;
    deleteImage: boolean;
  },
  {
    rejectValue: rejectPayload;
  }
>(
  'users/editProfile',
  async (
    {name, introduce, image, message, deleteImage},
    {rejectWithValue, dispatch},
  ) => {
    const keychain = await checkKeychain();

    if (keychain) {
      try {
        const response = await axios.patch<
          Pick<User, 'id' | 'name' | 'introduce' | 'image' | 'message'>
        >(
          `${origin}/user`,
          {
            id: keychain.id,
            name,
            introduce,
            image,
            message,
            deleteImage,
          },
          headers(keychain.token),
        );

        return response.data;
      } catch (e) {
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);

export const updatePositionThunk = createAsyncThunk(
  'users/updatePosition',
  async ({lat, lng}: {lat: number | null; lng: number | null}, thunkAPI) => {
    const keychain = await checkKeychain();
    if (keychain) {
      const response = await sendPosition({
        id: keychain.id,
        token: keychain.token,
        lat,
        lng,
      });

      if (response.type === 'success') {
        return {lat, lng};
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(logoutAction);
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
        thunkAPI.dispatch(logoutAction);
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
          thunkAPI.dispatch(logoutAction);
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
        thunkAPI.dispatch(logoutAction);
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);

export const refreshUserThunk = createAsyncThunk<
  {isMyData: true; data: User} | {isMyData: false; data: AnotherUser},
  {userId: number},
  {rejectValue: rejectPayload}
>('users/refreshUser', async ({userId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.patch<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >(
        `${origin}/user/refresh`,
        {userId, id: credentials.id},
        headers(credentials.token),
      );
      return response.data;
    } catch (e) {
      // axiosエラー
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // credentialsなしのログインエラー
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
