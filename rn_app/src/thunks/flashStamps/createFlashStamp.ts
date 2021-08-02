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

// import {StampValues} from '~/stores/flashStamps';

// export type CreateFlashStampPayload = {
//   ownerId: string;
//   flashId: number;
//   value: StampValues;
//   userId: string;
// };

// export const createFlashStampThunk = createAsyncThunk<
//   CreateFlashStampPayload,
//   {flashId: number; value: string; ownerId: string},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'flashStamps/createFlashStamp',
//   async ({flashId, value, ownerId}, {dispatch, rejectWithValue}) => {
//     const credentials = await checkKeychain();

//     if (credentials) {
//       try {
//         const response = await axios.post<
//           Omit<CreateFlashStampPayload, 'anotherUserId'>
//         >(
//           `${origin}/flashStamps?id=${credentials.id}`,
//           {
//             flashId,
//             value,
//           },
//           headers(credentials.token),
//         );

//         return {
//           ...response.data,
//           ownerId,
//         };
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
