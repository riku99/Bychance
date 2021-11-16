// import {
//   axios,
//   createAsyncThunk,
//   origin,
//   headers,
//   handleBasicApiErrorWithDispatch,
//   RejectPayload,
//   checkKeychain,
//   handleCredentialsError,
// } from '../re-modules';

// import {showBottomToast} from '~/stores/bottomToast';

// export type DeletePostThunkPaylaod = number;

// export const deletePostThunk = createAsyncThunk<
//   DeletePostThunkPaylaod,
//   {postId: number},
//   {rejectValue: RejectPayload}
// >('post/deletePost', async ({postId}, {dispatch, rejectWithValue}) => {
//   const idToken = await getIdToken();
//   if (credentials) {
//     try {
//       await axios.request({
//         method: 'delete',
//         url: `${origin}/posts?id=${credentials.id}`,
//         data: {postId},
//         ...headers(credentials.token),
//       });

//       dispatch(
//         showBottomToast({
//           data: {
//             type: 'success',
//             message: '削除しました',
//           },
//         }),
//       );

//       return postId;
//     } catch (e) {
//       const result = handleBasicApiErrorWithDispatch({e, dispatch});
//       return rejectWithValue(result);
//     }
//   } else {
//     handleCredentialsError(dispatch);
//     return rejectWithValue({errorType: 'loginError'});
//   }
// });
