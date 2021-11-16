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

// export type CreateAlreadyViewdFlashThunkPayload = {
//   userId: string;
//   flashId: number;
// };

// export const createAlreadyViewdFlashThunk = createAsyncThunk<
//   CreateAlreadyViewdFlashThunkPayload,
//   {flashId: number; userId: string},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'flashes/createAlreadyViewdFlash',
//   async ({flashId, userId}, {dispatch, rejectWithValue}) => {
//     const idToken = await getIdToken();

//     if (credentials) {
//       try {
//         await axios.post(
//           `${origin}/viewedFlashes?id=${credentials.id}`,
//           {flashId},
//           headers(credentials.token),
//         );

//         return {userId, flashId};
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
