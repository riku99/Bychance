import {
  axios,
  createAsyncThunk,
  rejectPayload,
  logoutAction,
  checkKeychain,
  requestLogin,
  handleBasicError,
  headers,
  origin,
} from '../re-modules';

export type CreateAlreadyViewdFlashThunkPayload = {
  userId: string;
  flashId: number;
};

export const createAlreadyViewdFlashThunk = createAsyncThunk<
  CreateAlreadyViewdFlashThunkPayload,
  {flashId: number; userId: string},
  {
    rejectValue: rejectPayload;
  }
>(
  'flashes/createAlreadyViewdFlash',
  async ({flashId, userId}, {dispatch, rejectWithValue}) => {
    const credentials = await checkKeychain();

    if (credentials) {
      try {
        await axios.post(
          `${origin}/viewedFlashes?id=${credentials.id}`,
          {flashId},
          headers(credentials.token),
        );

        return {userId, flashId};
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
