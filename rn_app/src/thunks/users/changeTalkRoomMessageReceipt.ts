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

// export type ChangeTalkRoomMessageReceiptPaylpad = boolean;

// export const changeTalkRoomMessageReceiptThunk = createAsyncThunk<
//   ChangeTalkRoomMessageReceiptPaylpad,
//   {receipt: boolean},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'users/changeTalkRoomMessageReceipt',
//   async ({receipt}, {rejectWithValue, dispatch}) => {
//     const idToken = await getIdToken();

//     if (credentials) {
//       try {
//         await axios.patch(
//           `${origin}/users/talkRoomMessageReceipt?id=${credentials.id}`,
//           {receipt},
//           headers(credentials.token),
//         );

//         return receipt;
//       } catch (e) {
//         const result = handleBasicApiErrorWithDispatch({e, dispatch});
//         return rejectWithValue(result);
//       }
//     } else {
//       handleCredentialsError(dispatch);
//       return rejectWithValue({errorType: 'loginError'});
//     }
//   },
// );
