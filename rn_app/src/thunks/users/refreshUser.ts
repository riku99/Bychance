import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiErrorWithDispatch,
  RejectPayload,
  handleCredentialsError,
} from '../re-modules';
import {User} from '../../stores/user';
import {AnotherUser} from '../../stores/types';
import {Post} from '~/stores/posts';
import {Flash} from '~/stores/flashes';
import {FlashStamp} from '~/stores/flashStamps';

export type RefreshUserThunkPaylaod =
  | {
      isMyData: true;
      user: User;
      posts: Post[];
      flashes: Flash[];
      flashStamps: FlashStamp[];
    }
  | {isMyData: false; data: {user: AnotherUser; flashStamps: FlashStamp[]}};

export const refreshUserThunk = createAsyncThunk<
  RefreshUserThunkPaylaod,
  {userId: string},
  {rejectValue: RejectPayload}
>('users/refreshUser', async ({userId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.get<RefreshUserThunkPaylaod>(
        `${origin}/users/refresh/${userId}?id=${credentials.id}`,
        headers(credentials.token),
      );

      return response.data;
    } catch (e) {
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
