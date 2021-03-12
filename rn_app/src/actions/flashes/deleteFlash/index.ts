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
} from '../../re-modules';

export type DeleteFlashThunkPayload = number;

export const deleteFlashThunk = createAsyncThunk<
  DeleteFlashThunkPayload,
  {flashId: number},
  {
    rejectValue: rejectPayload;
  }
>('flashes/delete', async ({flashId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.request<{success: true}>({
        method: 'delete',
        url: `${origin}/flashes`,
        data: {id: credentials.id, flashId},
        ...headers(credentials.token),
      });
      return flashId;
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
