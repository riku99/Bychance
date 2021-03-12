import {
  axios,
  createAsyncThunk,
  logoutAction,
  origin,
  headers,
  checkKeychain,
  requestLogin,
  handleBasicError,
  rejectPayload,
} from '../../re-modules';
import {User} from '../../../redux/user';
import {AnotherUser} from '../../../redux/types';

export type RefreshUserThunkPaylaod =
  | {isMyData: true; data: User}
  | {isMyData: false; data: AnotherUser};

export const refreshUserThunk = createAsyncThunk<
  RefreshUserThunkPaylaod,
  {userId: number},
  {rejectValue: rejectPayload}
>('users/refreshUser', async ({userId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      const response = await axios.patch<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >(
        `${origin}/user/refresh`,
        {userId, id: credentials.id},
        headers(credentials.token),
      );
      return response.data;
    } catch (e) {
      // axiosエラー
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // credentialsなしのログインエラー
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
