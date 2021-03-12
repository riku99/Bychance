import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicError,
  rejectPayload,
} from '../../re-modules';

export type EidtUserDisplayThunk = boolean;

export const editUserDisplayThunk = createAsyncThunk<
  EidtUserDisplayThunk,
  boolean,
  {rejectValue: rejectPayload}
>('users/editUserDisplay', async (display, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      await axios.patch(
        `${origin}/user/display`,
        {accessId: credentials.id, display},
        headers(credentials.token),
      );
      return display;
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
