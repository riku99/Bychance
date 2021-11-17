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

// export const createReadMessagesThunk = createAsyncThunk<
//   void,
//   {roomId: number; unreadNumber: number; partnerId: string},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'messages/createReadMessages',
//   async ({roomId, unreadNumber, partnerId}, {dispatch, rejectWithValue}) => {
//     const idToken = await getIdToken();

//     if (credentials) {
//       try {
//         axios.post(
//           `${origin}/readTalkRoomMessages?id=${credentials.id}`,
//           {
//             talkRoomId: roomId,
//             partnerId,
//             unreadNumber,
//           },
//           headers(credentials.token),
//         );
//       } catch (e) {
//         // axioserror
//         const result = handleBasicApiErrorWithDispatch({e, dispatch});
//         return rejectWithValue(result);
//       }
//     } else {
//       // loginerror
//       handleCredentialsError(dispatch);
//       return rejectWithValue({errorType: 'loginError'});
//     }
//   },
// );
