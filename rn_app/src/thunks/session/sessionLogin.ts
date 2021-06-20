import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  handleBasicApiErrorWithDispatch,
  RejectPayload,
  SuccessfullLoginData,
  Credentials,
} from '../re-modules';

export type SessionLoginThunkPayload = SuccessfullLoginData;

export const sessionLoginThunk = createAsyncThunk<
  SessionLoginThunkPayload,
  Credentials,
  {rejectValue: RejectPayload}
>('sessions/sessionLogin', async ({id, token}, {dispatch, rejectWithValue}) => {
  try {
    const response = await axios.get<SuccessfullLoginData>(
      `${origin}/sessions/sessionlogin?id=${id}`,
      headers(token),
    );

    return response.data;
  } catch (e) {
    const result = handleBasicApiErrorWithDispatch({e, dispatch});
    return rejectWithValue(result);
  }
});
