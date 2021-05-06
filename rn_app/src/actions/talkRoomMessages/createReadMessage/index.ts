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

export const createReadMessagesThunk = createAsyncThunk<
  void,
  {roomId: number; unreadNumber: number; partnerId: string},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createReadMessages',
  async ({roomId, unreadNumber, partnerId}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        axios.post(
          `${origin}/readTalkRoomMessages?id=${credentials.id}`,
          {
            talkRoomId: roomId,
            partnerId,
            unreadNumber,
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
