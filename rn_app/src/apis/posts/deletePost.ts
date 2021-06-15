import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  handleBasicApiErrorWithDispatch,
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
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
