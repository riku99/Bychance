import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  handleBasicApiError,
  RejectPayload,
  checkKeychain,
  requestLogin,
  logoutAction,
} from '../re-modules';
import {Post} from '../../stores/posts';

export type CreatePostThunkPayload = Post;

export const createPostThunk = createAsyncThunk<
  Post,
  {text: string; source: string; ext: string; sourceType: 'image' | 'video'},
  {rejectValue: RejectPayload}
>(
  'posts/createPost',
  async ({text, source, ext, sourceType}, {rejectWithValue, dispatch}) => {
    const credentials = await checkKeychain();
    if (credentials) {
      try {
        const response = await axios.post<Post>(
          `${origin}/posts?id=${credentials.id}`,
          {text, source, ext, sourceType},
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
  },
);
