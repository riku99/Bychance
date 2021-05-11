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
} from '../re-modules';
import {TalkRoomMessage} from '../../stores/talkRoomMessages';

export type CreateMessageThunkPayload = {
  message: TalkRoomMessage;
  roomId: number;
};

export const createMessageThunk = createAsyncThunk<
  CreateMessageThunkPayload,
  {roomId: number; partnerId: string; text: string; isFirstMessage: boolean},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createMessage',
  async (
    {roomId, partnerId, text, isFirstMessage},
    {dispatch, rejectWithValue},
  ) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<TalkRoomMessage>(
          `${origin}/talkRoomMessages?id=${credentials.id}`,
          {
            talkRoomId: roomId,
            text,
            partnerId,
            isFirstMessage,
          },
          headers(credentials.token),
        );

        return {message: response.data, roomId};
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
