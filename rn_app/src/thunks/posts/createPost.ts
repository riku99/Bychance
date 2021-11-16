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
// import {Post} from '../../stores/posts';
// import {showBottomToast} from '~/stores/bottomToast';

// export type CreatePostThunkPayload = Post;

// export const createPostThunk = createAsyncThunk<
//   Post,
//   {text: string; source: string; ext: string; sourceType: 'image' | 'video'},
//   {rejectValue: RejectPayload}
// >(
//   'posts/createPost',
//   async ({text, source, ext, sourceType}, {rejectWithValue, dispatch}) => {
//     const idToken = await getIdToken();
//     if (credentials) {
//       try {
//         const response = await axios.post<Post>(
//           `${origin}/posts?id=${credentials.id}`,
//           {text, source, ext, sourceType},
//           headers(credentials.token),
//         );

//         dispatch(
//           showBottomToast({
//             data: {
//               type: 'success',
//               message: '投稿しました',
//             },
//           }),
//         );

//         return response.data;
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
