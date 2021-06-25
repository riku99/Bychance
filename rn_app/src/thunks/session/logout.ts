import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiErrorWithDispatch,
  handleCredentialsError,
  RejectPayload,
} from '../re-modules';
import * as Keychain from 'react-native-keychain';

export const logoutThunk = createAsyncThunk<
  undefined,
  undefined,
  {rejectValue: RejectPayload}
>('sessions/logout', async (_, {dispatch, rejectWithValue}) => {
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
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});

export const loguotAction = {
  type: logoutThunk.fulfilled.type,
};
