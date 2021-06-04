import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicApiError,
  RejectPayload,
} from '../re-modules';
import {User} from '../../stores/user';
import {AnotherUser} from '../../stores/types';

export type RefreshUserThunkPaylaod =
  | {isMyData: true; data: User}
  | {isMyData: false; data: AnotherUser};

export const refreshUserThunk = createAsyncThunk<
  RefreshUserThunkPaylaod,
  {userId: string},
  {rejectValue: RejectPayload}
>('users/refreshUser', async ({userId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.patch<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >(
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
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
