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

export const logoutAction = {
  type: 'session/logout',
};

export const logutThunk = createAsyncThunk<
  undefined,
  undefined,
  {rejectValue: RejectPayload}
>('sessions/logout', async (_, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
    } catch (e) {
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
