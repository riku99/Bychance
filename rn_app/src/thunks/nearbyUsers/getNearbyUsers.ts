// import {NearbyUsers} from '../../stores/nearbyUsers';
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

// import {FlashStamp} from '~/stores/flashStamps';

// export type GetNearbyUsersPayload = {
//   usersData: NearbyUsers;
//   flashStampsData: FlashStamp[];
// };

// export const getNearbyUsersThunk = createAsyncThunk<
//   GetNearbyUsersPayload,
//   {lat: number | null; lng: number | null; range: number},
//   {
//     rejectValue: RejectPayload;
//   }
// >(
//   'others/getNearbyUsersThunk',
//   async ({lat, lng, range}, {dispatch, rejectWithValue}) => {
//     const idToken = await getIdToken();
//     if (credentials) {
//       try {
//         const response = await axios.get<GetNearbyUsersPayload>(
//           `${origin}/nearbyUsers?id=${credentials.id}&lat=${lat}&lng=${lng}&range=${range}`,
//           headers(credentials.token),
//         );

//         return response.data;
//       } catch (e) {
//         const result = handleBasicApiErrorWithDispatch({dispatch, e});
//         return rejectWithValue(result);
//       }
//     } else {
//       handleCredentialsError(dispatch);
//       return rejectWithValue({errorType: 'loginError'});
//     }
//   },
// );
