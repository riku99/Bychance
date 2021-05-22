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

export type EditProfilePayload = Pick<
  User,
  | 'id'
  | 'name'
  | 'introduce'
  | 'avatar'
  | 'statusMessage'
  | 'backGroundItem'
  | 'backGroundItemType'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
>;

export const editProfileThunk = createAsyncThunk<
  EditProfilePayload,
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
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    tiktok: string | null;
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
      instagram,
      tiktok,
      twitter,
      youtube,
    },
    {rejectWithValue, dispatch},
  ) => {
    const credentials = await checkKeychain();

    if (credentials) {
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
            | 'instagram'
            | 'twitter'
            | 'tiktok'
            | 'youtube'
          >
        >(
          `${origin}/users?id=${credentials.id}`,
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
            instagram,
            twitter,
            youtube,
            tiktok,
          },
          headers(credentials.token),
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
