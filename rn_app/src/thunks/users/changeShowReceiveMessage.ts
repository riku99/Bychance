// import {
//   axios,
//   createAsyncThunk,
//   origin,
//   headers,
//   checkKeychain,
//   handleBasicApiErrorWithDispatch,
//   RejectPayload,
//   handleCredentialsError,
// } from '../re-modules';

// export type ChangeShowReceiveMessagePayload = boolean;

// export const changeShowReceiveMessageThunk = createAsyncThunk<
//   ChangeShowReceiveMessagePayload,
//   {showReceiveMessage: boolean},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'users/changeShowReceiveMessage',
//   async ({showReceiveMessage}, {rejectWithValue, dispatch}) => {
//     const idToken = await getIdToken();

//     if (credentials) {
//       try {
//         await axios.patch(
//           `${origin}/users/showReceiveMessage?id=${credentials.id}`,
//           {showReceiveMessage},
//           headers(credentials.token),
//         );

//         return showReceiveMessage;
//       } catch (e) {
//         const result = handleBasicApiErrorWithDispatch(e);
//         return rejectWithValue(result);
//       }
//     } else {
//       handleCredentialsError(dispatch);
//       return rejectWithValue({errorType: 'loginError'});
//     }
//   },
// );
