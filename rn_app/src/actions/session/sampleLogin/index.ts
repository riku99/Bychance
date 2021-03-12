import {
  axios,
  createAsyncThunk,
  origin,
  SuccessfullLoginData,
} from '../../re-modules';
import * as Keychain from 'react-native-keychain';

export type SampleLoginThunkPayload = SuccessfullLoginData & {token: string};

export const sampleLogin = createAsyncThunk('sample/login', async () => {
  const response = await axios.post<SampleLoginThunkPayload>(
    `${origin}/sample_login`,
  );
  await Keychain.resetGenericPassword();
  await Keychain.setGenericPassword(
    String(response.data.user.id),
    response.data.token,
  );
  return response.data;
});
