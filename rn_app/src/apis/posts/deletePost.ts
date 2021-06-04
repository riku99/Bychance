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

export type DeletePostThunkPaylaod = number;

export const deletePostThunk = createAsyncThunk<
  DeletePostThunkPaylaod,
  {postId: number},
  {rejectValue: RejectPayload}
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
      const result = handleBasicApiError({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    requestLogin(() => dispatch(logoutAction));
    return rejectWithValue({errorType: 'loginError'});
  }
});
