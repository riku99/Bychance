import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiError,
  RejectPayload,
  handleCredentialsError,
} from '../re-modules';

export type ChangeTalkRoomMessageReceiptPaylpad = boolean;

export const changeTalkRoomMessageReceiptThunk = createAsyncThunk<
  ChangeTalkRoomMessageReceiptPaylpad,
  {receipt: boolean},
  {
    rejectValue: RejectPayload;
  }
>(
  'users/changeTalkRoomMessageReceipt',
  async ({receipt}, {rejectWithValue, dispatch}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        await axios.patch(
          `${origin}/users/talkRoomMessageReceipt?id=${credentials.id}`,
          {receipt},
          headers(credentials.token),
        );

        return receipt;
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
