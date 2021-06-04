import {
  axios,
  createAsyncThunk,
  RejectPayload,
  logoutAction,
  checkKeychain,
  requestLogin,
  handleBasicApiError,
  headers,
  origin,
} from '../re-modules';

export const createDeviceToken = createAsyncThunk<
  undefined,
  {token: string},
  {rejectValue: RejectPayload}
>(
  'deviceToken/createDeviceToken',
  async ({token}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        await axios.post(
          `${origin}/deviceToken?id=${credentials.id}`,
          {token},
          headers(credentials.token),
        );

        return;
      } catch (e) {
        // axiosエラー
        const result = handleBasicApiError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      // credentialsなしエラー
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
