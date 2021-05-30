import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicError,
  rejectPayload,
} from '../re-modules';

export type ChangeTalkRoomMessageReceiptPaylpad = boolean;

export const changeTalkRoomMessageReceiptThunk = createAsyncThunk<
  ChangeTalkRoomMessageReceiptPaylpad,
  {receipt: boolean},
  {
    rejectValue: rejectPayload;
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
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
