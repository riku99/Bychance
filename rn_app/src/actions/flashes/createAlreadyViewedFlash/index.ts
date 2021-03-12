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
} from '../../utils/modules';

export type CreateAlreadyViewdFlashThunkPayload = {
  userId: number;
  flashId: number;
};

export const createAlreadyViewdFlashThunk = createAsyncThunk<
  CreateAlreadyViewdFlashThunkPayload,
  {flashId: number; userId: number},
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
          `${origin}/user_flash_viewing`,
          {id: credentials.id, flashId},
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
