import {
  axios,
  createAsyncThunk,
  RejectPayload,
  checkKeychain,
  handleBasicApiErrorWithDispatch,
  headers,
  origin,
  handleCredentialsError,
  showBottomToast,
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

      dispatch(
        showBottomToast({
          data: {
            type: 'success',
            message: '削除しました',
          },
        }),
      );

      return {talkRoomId};
    } catch (e) {
      const result = handleBasicApiErrorWithDispatch({e, dispatch});
      return rejectWithValue(result);
    }
  } else {
    handleCredentialsError(dispatch);
    return rejectWithValue({errorType: 'loginError'});
  }
});
