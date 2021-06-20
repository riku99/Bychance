import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicApiErrorWithDispatch,
  RejectPayload,
} from '../re-modules';

export type ChangeVideoEditDescriptionPayload = boolean;

export const changeVideoEditDescriptionThunk = createAsyncThunk<
  ChangeVideoEditDescriptionPayload,
  boolean,
  {
    rejectValue: RejectPayload;
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
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
