import {
  axios,
  createAsyncThunk,
  RejectPayload,
  checkKeychain,
  handleBasicApiError,
  headers,
  origin,
  handleCredentialsError,
} from '../re-modules';

export type CreateFlashStamp = null;

export const createFlashStampThunk = createAsyncThunk<
  undefined,
  {flashId: number; value: string},
  {
    rejectValue: RejectPayload;
  }
>(
  'flashStamps/createFlashStamp',
  async ({flashId, value}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        await axios.post(
          `${origin}/flashStamps?id=${credentials.id}`,
          {
            flashId,
            value,
          },
          headers(credentials.token),
        );
      } catch (e) {
        const result = handleBasicApiError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      handleCredentialsError(dispatch);
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
