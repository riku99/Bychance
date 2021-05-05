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
import {AnotherUser} from '../../stores/types';

export type CreateRoomThunkPayload = {
  presence: boolean;
  roomId: number;
  partner: AnotherUser;
  timestamp: string;
};

export const createRoomThunk = createAsyncThunk<
  CreateRoomThunkPayload,
  {partner: AnotherUser},
  {rejectValue: rejectPayload}
>('chats/createRoom', async ({partner}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.post<{
        presence: boolean;
        roomId: number;
        timestamp: string;
      }>(
        `${origin}/talkRooms?id=${credentials.id}`,
        {partnerId: partner.id},
        headers(credentials.token),
      );

      return {...response.data, partner};
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // loginerror
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
