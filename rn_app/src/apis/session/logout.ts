import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiError,
  handleCredentialsError,
  RejectPayload,
} from '../re-modules';
import * as Keychain from 'react-native-keychain';

export const logoutAction = {
  type: 'session/logout',
};

export const logutThunk = createAsyncThunk<
  undefined,
  undefined,
  {rejectValue: RejectPayload}
>('sessions/logou', async (_, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      await axios.get(
        `${origin}/sessions/logout?id=${credentials.id}`,
        headers(credentials.token),
      );

      await Keychain.resetGenericPassword(); // ログアウトするからキーチェーンの中身リセット
      return;
    } catch (e) {
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
