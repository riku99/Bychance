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
import {Flash} from '../../stores/flashes';
import {FlashStamp} from '~/stores/flashStamps';

export type CreateFlashThunkPaylaod = {flash: Flash; stamps: FlashStamp};

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
        const response = await axios.post<{flash: Flash; stamps: FlashStamp}>(
          `${origin}/flashes?id=${credentials.id}`,
          {source, sourceType, ext},
          headers(credentials.token),
        );

        return response.data;
      } catch (e) {
        const result = handleBasicApiErrorWithDispatch({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      handleCredentialsError(dispatch);
    }
    return rejectWithValue({errorType: 'loginError'});
  },
);
