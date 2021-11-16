// import {
//   axios,
//   createAsyncThunk,
//   RejectPayload,
//   checkKeychain,
//   handleBasicApiErrorWithDispatch,
//   headers,
//   origin,
//   handleCredentialsError,
// } from '../re-modules';

// export const createDeviceToken = createAsyncThunk<
//   undefined,
//   {token: string},
//   {rejectValue: RejectPayload}
// >(
//   'deviceToken/createDeviceToken',
//   async ({token}, {dispatch, rejectWithValue}) => {
//     const idToken = await getIdToken();

//     if (credentials) {
//       try {
//         await axios.post(
//           `${origin}/deviceToken?id=${credentials.id}`,
//           {token},
//           headers(credentials.token),
//         );

//         return;
//       } catch (e) {
//         // axiosエラー
//         const result = handleBasicApiErrorWithDispatch({e, dispatch});
//         return rejectWithValue(result);
//       }
//     } else {
//       // credentialsなしエラー
//       handleCredentialsError(dispatch);
//       return rejectWithValue({errorType: 'loginError'});
//     }
//   },
// );
