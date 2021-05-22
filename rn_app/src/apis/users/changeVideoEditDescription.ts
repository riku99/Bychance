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
} from '../re-modules';

export type ChangeVideoEditDescriptionPayload = boolean;

export const changeVideoEditDescriptionThunk = createAsyncThunk<
  ChangeVideoEditDescriptionPayload,
  boolean,
  {
    rejectValue: rejectPayload;
  }
>('users/changeEditDescription', async (bool, {rejectWithValue, dispatch}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.patch(
        `${origin}/users/videoEditDescription?id=${credentials.id}`,
        {videoEditDescription: bool},
        headers(credentials.token),
      );

      return bool;
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
