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

export type DeleteFlashThunkPayload = number;

export const deleteFlashThunk = createAsyncThunk<
  DeleteFlashThunkPayload,
  {flashId: number},
  {
    rejectValue: RejectPayload;
  }
>('flashes/delete', async ({flashId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.delete(
        `${origin}/flashes/${flashId}?id=${credentials.id}`,
        headers(credentials.token),
      );

      return flashId;
    } catch (e) {
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
