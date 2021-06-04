import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicApiError,
  RejectPayload,
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
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
