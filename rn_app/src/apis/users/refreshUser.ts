import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  checkKeychain,
  handleBasicApiError,
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
      const response = await axios.patch<RefreshUserThunkPaylaod>(
        `${origin}/users/refresh?id=${credentials.id}`,
        {userId},
        headers(credentials.token),
      );

      return response.data;
    } catch (e) {
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
