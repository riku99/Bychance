// import {
//   axios,
//   createAsyncThunk,
//   origin,
//   SuccessfullLoginData,
// } from '../re-modules';
// import * as Keychain from 'react-native-keychain';

// export type SampleLoginThunkPayload = SuccessfullLoginData & {
//   accessToken: string;
// };

// export const sampleLogin = createAsyncThunk('sample/login', async () => {
//   const response = await axios.get<SampleLoginThunkPayload>(
//     `${origin}/sampleLogin`,
//   );
//   await Keychain.resetGenericPassword();
//   await Keychain.setGenericPassword(
//     response.data.user.id,
//     response.data.accessToken,
//   );
//   return response.data;
// });
