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
import {Message} from '../../../redux/messages';

export type CreateMessageThunkPayload = {message: Message; roomId: number};

export const createMessageThunk = createAsyncThunk<
  CreateMessageThunkPayload,
  {roomId: number; userId: number; text: string},
  {
    rejectValue: rejectPayload;
  }
>(
  'messages/createMessage',
  async ({roomId, userId, text}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        const response = await axios.post<Message>(
          `${origin}/messages`,
          {
            roomId,
            userId,
            text,
            accessId: credentials.id,
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
