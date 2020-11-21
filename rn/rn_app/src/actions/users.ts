import {createAsyncThunk} from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import LineLogin from '@xmartlabs/react-native-line';
import {showMessage} from 'react-native-flash-message';

import {
  sendIDtoken,
  sendAccessToken,
  sendNonce,
  sendEditedProfile,
  sendRequestToChangeDisplay,
  sendPosition,
  sampleLoginApi,
} from '../apis/usersApi';
import {checkKeychain, Credentials} from '../helpers/keychain';
import {requestLogin} from '../helpers/login';
import {alertSomeError} from '../helpers/error';
import {getCurrentPosition} from '../helpers/gelocation';
import {logout} from '../redux/index';

export const sampleLogin = createAsyncThunk('sample/login', async () => {
  const response = await sampleLoginApi();
  await Keychain.resetGenericPassword();
  await Keychain.setGenericPassword(String(response.user.id), response.token);
  return response;
});

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
        lat: position ? position.coords.latitude : null,
        lng: position ? position.coords.longitude : null,
      });

      if (response.type === 'success') {
        await Keychain.resetGenericPassword();
        await Keychain.setGenericPassword(
          String(response.data.user.id),
          response.data.token,
        );
        return response.data;
      }

      if (response.type === 'loginError') {
        const callback = () => {
          thunkAPI.dispatch(logout());
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
        return thunkAPI.rejectWithValue({lineCancelled: true});
      }
    }
  },
);

export const subsequentLoginAction = createAsyncThunk(
  'users/subsequentLogin',
  async ({id, token}: Credentials, thunkAPI) => {
    const response = await sendAccessToken({id, token});

    if (response.type === 'success') {
      return response.data;
    }
    if (response.type === 'loginError') {
      const callback = () => {
        thunkAPI.dispatch(logout());
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
          thunkAPI.dispatch(logout());
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
        thunkAPI.dispatch(logout());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
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
        showMessage({
          message: '変更しました',
          type: 'success',
          style: {opacity: 0.9},
          titleStyle: {fontWeight: 'bold'},
        });
        return response.user;
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
        return thunkAPI.rejectWithValue({invalid: true});
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
          thunkAPI.dispatch(logout());
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
        thunkAPI.dispatch(logout());
      };
      requestLogin(callback);
      return thunkAPI.rejectWithValue({loginError: true});
    }
  },
);
