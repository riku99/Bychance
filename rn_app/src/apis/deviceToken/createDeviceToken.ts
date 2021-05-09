import {
  axios,
  createAsyncThunk,
  rejectPayload,
  logoutAction,
  checkKeychain,
  requestLogin,
  handleBasicError,
  headers,
  origin,
} from '../re-modules';

export const createDeviceToken = createAsyncThunk<
  undefined,
  {token: string},
  {rejectValue: rejectPayload}
>(
  'deviceToken/createDeviceToken',
  async ({token}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        console.log('go');
        await axios.post(
          `${origin}/deviceToken?id=${credentials.id}`,
          {token},
          headers(credentials.token),
        );

        return;
      } catch (e) {
        // axiosエラー
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      // credentialsなしエラー
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
