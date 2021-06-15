import {
  axios,
  createAsyncThunk,
  RejectPayload,
  checkKeychain,
  handleBasicApiErrorWithDispatch,
  headers,
  origin,
  handleCredentialsError,
} from '../re-modules';

export type CreateDeleteRoomThunkPayload = {
  talkRoomId: number;
};

export const createDeleteRoomThunk = createAsyncThunk<
  CreateDeleteRoomThunkPayload,
  {talkRoomId: number},
  {rejectValue: RejectPayload}
>('talkRooms/delete', async ({talkRoomId}, {dispatch, rejectWithValue}) => {
  const credentials = await checkKeychain();

  if (credentials) {
    try {
      await axios.delete(
        `${origin}/talkRooms/${talkRoomId}?id=${credentials.id}`,
        headers(credentials.token),
      );

      return {talkRoomId};
    } catch (e) {
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    // credentials存在しないエラー
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
