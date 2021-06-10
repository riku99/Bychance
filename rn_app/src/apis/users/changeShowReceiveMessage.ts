import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiError,
  RejectPayload,
  handleCredentialsError,
} from '../re-modules';

export type ChangeShowReceiveMessagePayload = boolean;

export const changeShowReceiveMessageThunk = createAsyncThunk<
  ChangeShowReceiveMessagePayload,
  {showReceiveMessage: boolean},
  {
    rejectValue: RejectPayload;
  }
>(
  'users/changeShowReceiveMessage',
  async ({showReceiveMessage}, {rejectWithValue, dispatch}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        await axios.patch(
          `${origin}/users/showReceiveMessage?id=${credentials.id}`,
          {showReceiveMessage},
          headers(credentials.token),
        );

        return showReceiveMessage;
      } catch (e) {
        const result = handleBasicApiError(e);
        return rejectWithValue(result);
      }
    } else {
      handleCredentialsError(dispatch);
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
