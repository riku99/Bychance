// import {
//   axios,
//   createAsyncThunk,
//   origin,
//   headers,
//   handleBasicApiErrorWithDispatch,
//   RejectPayload,
//   SuccessfullLoginData,
// } from '../re-modules';
// import LineLogin from '@xmartlabs/react-native-line';
// import * as Keychain from 'react-native-keychain';

// export type LineLoginThunkPayload = SuccessfullLoginData;

// export const lineLoginThunk = createAsyncThunk<
//   LineLoginThunkPayload | void,
//   undefined,
//   {rejectValue: RejectPayload}
// >('users/lineLogin', async (dummy, {dispatch, rejectWithValue}) => {
//   try {
//     const loginResult = await LineLogin.login({
//       // @ts-ignore ドキュメント通りにやっても直らなかったのでignore
//       scopes: ['openid', 'profile'],
//     });
//     const idToken = loginResult.accessToken.id_token;
//     const nonce = loginResult.IDTokenNonce;

//     await axios.post(`${origin}/nonce`, {nonce});

//     const response = await axios.post<
//       SuccessfullLoginData & {accessToken: string}
//     >(
//       `${origin}/sessions/lineLogin`,
//       {},
//       idToken && headers(idToken as string),
//     );

//     // 成功したらキーチェーンにcredentialsを保存
//     await Keychain.resetGenericPassword();
//     await Keychain.setGenericPassword(
//       String(response.data.user.id),
//       response.data.accessToken,
//     );

//     const {accessToken, ...restData} = response.data; // eslint-disable-line
//     return restData;
//   } catch (e) {
//     if (e.message === 'User cancelled or interrupted the login process.') {
//       console.log('cancelled');
//     } else {
//       const result = handleBasicApiErrorWithDispatch({e, dispatch});
//       return rejectWithValue(result);
//     }
//   }
// });
