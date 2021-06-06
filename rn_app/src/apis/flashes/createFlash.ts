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
import {Flash} from '../../stores/flashes';

export type CreateFlashThunkPaylaod = Flash;

export const createFlashThunk = createAsyncThunk<
  CreateFlashThunkPaylaod,
  {sourceType: 'image' | 'video'; source: string; ext: string},
  {
    rejectValue: RejectPayload;
  }
>(
  'flashes/createFlash',
  async ({sourceType, source, ext}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<Flash>(
          `${origin}/flashes?id=${credentials.id}`,
          {source, sourceType, ext},
          headers(credentials.token),
        );

        return response.data;
      } catch (e) {
        const result = handleBasicApiError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      handleCredentialsError(dispatch);
    }
    return rejectWithValue({errorType: 'loginError'});
  },
);
