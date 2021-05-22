import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  handleBasicError,
  rejectPayload,
  SuccessfullLoginData,
  Credentials,
} from '../re-modules';

export type SessionLoginThunkPayload = SuccessfullLoginData;

export const sessionLoginThunk = createAsyncThunk<
  SessionLoginThunkPayload,
  Credentials,
  {rejectValue: rejectPayload}
>('users/sessionLogin', async ({id, token}, {dispatch, rejectWithValue}) => {
  try {
    const response = await axios.get<SuccessfullLoginData>(
      `${origin}/sessions?id=${id}`,
      headers(token),
    );

    console.log(response.data);

    return response.data;
  } catch (e) {
    const result = handleBasicError({e, dispatch});
    return rejectWithValue(result);
  }
});
