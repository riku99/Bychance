// import {
//   axios,
//   createAsyncThunk,
//   origin,
//   headers,
//   checkKeychain,
//   handleBasicApiErrorWithDispatch,
//   handleCredentialsError,
//   RejectPayload,
// } from '../re-modules';

// export type EidtUserDisplayThunkPayload = boolean;

// export const changeUserDisplayThunk = createAsyncThunk<
//   EidtUserDisplayThunkPayload,
//   boolean,
//   {rejectValue: RejectPayload}
// >('users/editUserDisplay', async (display, {dispatch, rejectWithValue}) => {
//   const idToken = await getIdToken();
//   if (credentials) {
//     try {
//       await axios.patch(
//         `${origin}/users/display?id=${credentials.id}`,
//         {display},
//         headers(credentials.token),
//       );

//       return display;
//     } catch (e) {
//       const result = handleBasicApiErrorWithDispatch({e, dispatch});
//       return rejectWithValue(result);
//     }
//   } else {
//     handleCredentialsError(dispatch);
//     return rejectWithValue({errorType: 'loginError'});
//   }
// });
