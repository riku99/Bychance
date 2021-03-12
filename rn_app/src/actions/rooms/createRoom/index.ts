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
import {AnotherUser} from '../../../redux/types';

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
        `${origin}/rooms`,
        {accessId: credentials.id, partnerId: partner.id},
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
