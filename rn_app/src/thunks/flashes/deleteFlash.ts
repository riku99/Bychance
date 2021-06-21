import {
  axios,
  createAsyncThunk,
  RejectPayload,
  checkKeychain,
  handleBasicApiErrorWithDispatch,
  headers,
  origin,
  handleCredentialsError,
} from '../re-modules';
import {showBottomToast} from '~/stores/bottomToast';

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

      dispatch(
        showBottomToast({
          data: {
            type: 'success',
            message: '削除しました',
          },
        }),
      );

      return flashId;
    } catch (e) {
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
