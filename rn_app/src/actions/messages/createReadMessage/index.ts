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
} from '../../utils/modules';

export const createReadMessagesThunk = createAsyncThunk<
  void,
  {roomId: number; unreadNumber: number},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createReadMessages',
  async ({roomId, unreadNumber}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        axios.post(
          `${origin}/user_room_message_reads`,
          {
            roomId,
            unreadNumber,
            id: credentials.id,
          },
          headers(credentials.token),
        );
      } catch (e) {
        // axioserror
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      // loginerror
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
