import {
  axios,
  createAsyncThunk,
  RejectPayload,
  logoutAction,
  checkKeychain,
  requestLogin,
  handleBasicApiError,
  headers,
  origin,
} from '../re-modules';
import {TalkRoomMessage} from '../../stores/talkRoomMessages';

type talkRoomPresence = {
  talkRoomPresence: true;
  message: TalkRoomMessage;
  talkRoomId: number;
};

type NotTalkRoomPresence = {
  talkRoomPresence: false;
  talkRoomId: number;
};

// トークルームが削除されていて
export type CreateMessageThunkPayload = talkRoomPresence | NotTalkRoomPresence;

export const createMessageThunk = createAsyncThunk<
  CreateMessageThunkPayload,
  {roomId: number; partnerId: string; text: string},
  {
    rejectValue: RejectPayload;
  }
>(
  'messages/createMessage',
  async ({roomId, partnerId, text}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<
          talkRoomPresence | NotTalkRoomPresence
        >(
          `${origin}/talkRoomMessages?id=${credentials.id}`,
          {
            talkRoomId: roomId,
            text,
            partnerId,
          },
          headers(credentials.token),
        );

        return response.data;
      } catch (e) {
        // axioserror
        const result = handleBasicApiError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      // loginerror
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
