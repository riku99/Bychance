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
  | 'id'
  | 'name'
  | 'introduce'
  | 'avatar'
  | 'statusMessage'
  | 'backGroundItem'
  | 'backGroundItemType'
>;

export const editProfileThunk = createAsyncThunk<
  EdiProfilePayload,
  {
    name: string;
    introduce: string;
    avatar: string | undefined;
    deleteAvatar: boolean;
    message: string;
    backGroundItem?: string;
    backGroundItemType?: 'image' | 'video';
    deleteBackGroundItem: boolean;
    backGroundItemExt?: string;
  },
  {
    rejectValue: rejectPayload;
  }
>(
  'users/editProfile',
  async (
    {
      name,
      introduce,
      avatar,
      message,
      deleteAvatar,
      backGroundItem,
      backGroundItemType,
      deleteBackGroundItem,
      backGroundItemExt,
    },
    {rejectWithValue, dispatch},
  ) => {
    const keychain = await checkKeychain();

    if (keychain) {
      try {
        const response = await axios.patch<
          Pick<
            User,
            | 'id'
            | 'name'
            | 'introduce'
            | 'avatar'
            | 'statusMessage'
            | 'backGroundItem'
            | 'backGroundItemType'
          >
        >(
          `${origin}/users?id=${keychain.id}`,
          {
            name,
            introduce,
            avatar,
            deleteAvatar,
            statusMessage: message,
            backGroundItem,
            backGroundItemType,
            deleteBackGroundItem,
            backGroundItemExt,
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
