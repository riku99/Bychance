import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleCredentialsError,
  handleBasicApiErrorWithDispatch,
  RejectPayload,
} from '../re-modules';

export type DeleteLocationThunkPayload = undefined;

export const deleteLocationInfoThunk = createAsyncThunk<
  DeleteLocationThunkPayload,
  undefined,
  {rejectValue: RejectPayload}
>('users/deteleLocationInfo', async (_, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.delete(
        `${origin}/users/location?id=${credentials.id}`,
        headers(credentials.token),
      );

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
