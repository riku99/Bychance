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

import {StampValues} from '~/stores/flashes';

export type CreateFlashStampPayload = {
  anotherUserId: string;
  flashId: number;
  value: StampValues;
  userId: string;
};

export const createFlashStampThunk = createAsyncThunk<
  CreateFlashStampPayload,
  {flashId: number; value: string; anotherUserId: string},
  {
    rejectValue: RejectPayload;
  }
>(
  'flashStamps/createFlashStamp',
  async ({flashId, value, anotherUserId}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<
          Omit<CreateFlashStampPayload, 'anotherUserId'>
        >(
          `${origin}/flashStamps?id=${credentials.id}`,
          {
            flashId,
            value,
          },
          headers(credentials.token),
        );

        return {
          ...response.data,
          anotherUserId,
        };
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
