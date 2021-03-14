import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  handleBasicError,
  rejectPayload,
  checkKeychain,
  requestLogin,
  logoutAction,
} from '../../re-modules';
import {Post} from '../../../stores/posts';

export type CreatePostThunkPayload = Post;

export const createPostThunk = createAsyncThunk<
  Post,
  {text: string; source: string},
  {rejectValue: rejectPayload}
>('posts/createPost', async ({text, source}, {rejectWithValue, dispatch}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      const response = await axios.post<Post>(
        `${origin}/post`,
        {text, image: source, accessId: credentials.id},
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
});
