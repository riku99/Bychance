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
} from '../re-modules';
import {User} from '../../stores/user';

export type EdiProfilePayload = Pick<
  User,
  'id' | 'name' | 'introduce' | 'avatar' | 'statusMessage'
>;

export const editProfileThunk = createAsyncThunk<
  EdiProfilePayload,
  {
    name: string;
    introduce: string;
    avatar: string | undefined;
    message: string;
    deleteImage: boolean;
  },
  {
    rejectValue: rejectPayload;
  }
>(
  'users/editProfile',
  async (
    {name, introduce, avatar, message, deleteImage},
    {rejectWithValue, dispatch},
  ) => {
    const keychain = await checkKeychain();

    if (keychain) {
      try {
        const response = await axios.patch<
          Pick<User, 'id' | 'name' | 'introduce' | 'avatar' | 'statusMessage'>
        >(
          `${origin}/users?id=${keychain.id}`,
          {
            name,
            introduce,
            avatar,
            statusMessage: message,
            deleteImage,
          },
          headers(keychain.token),
        );

        return response.data;
      } catch (e) {
        const result = handleBasicError({e, dispatch});
        return rejectWithValue(result);
      }
    } else {
      requestLogin(() => dispatch(logoutAction));
      return rejectWithValue({errorType: 'loginError'});
    }
  },
);
