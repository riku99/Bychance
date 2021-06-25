import {
  axios,
  createAsyncThunk,
  origin,
  headers,
  SuccessfullLoginData,
  Credentials,
} from '../re-modules';
import {requestLogin} from '~/helpers/errors';

export type SessionLoginThunkPayload = SuccessfullLoginData;

export const sessionLoginThunk = createAsyncThunk<
  SessionLoginThunkPayload,
  Credentials,
  {rejectValue: any}
>('sessions/sessionLogin', async ({id, token}, {rejectWithValue}) => {
  try {
    const response = await axios.get<SuccessfullLoginData>(
      `${origin}/sessions/sessionlogin?id=${id}`,
      headers(token),
    );

    return response.data;
  } catch (e) {
    requestLogin();
    return rejectWithValue(null);
  }
});
