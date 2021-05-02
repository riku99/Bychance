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
} from '../re-modules';

export type DeletePostThunkPaylaod = number;

export const deletePostThunk = createAsyncThunk<
  DeletePostThunkPaylaod,
  {postId: number},
  {rejectValue: rejectPayload}
>('post/deletePost', async ({postId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();
  if (credentials) {
    try {
      await axios.request({
        method: 'delete',
        url: `${origin}/posts?id=${credentials.id}`,
        data: {postId},
        ...headers(credentials.token),
      });

      return postId;
    } catch (e) {
      const result = handleBasicError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
