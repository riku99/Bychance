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

export type EidtUserDisplayThunkPayload = boolean;

export const changeUserDisplayThunk = createAsyncThunk<
  EidtUserDisplayThunkPayload,
  boolean,
  {rejectValue: RejectPayload}
>('users/editUserDisplay', async (display, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      await axios.patch(
        `${origin}/users/display?id=${credentials.id}`,
        {display},
        headers(credentials.token),
      );

      return display;
    } catch (e) {
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
