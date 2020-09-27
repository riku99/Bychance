import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createPostAction} from '../actions/posts_action';

type initialStateType = {
  post?: {id: number; text: string; image: string};
  posts: {id: number; text: string; image: string}[];
  info?: string;
  errors?: {invalidError: string};
  redirect?: boolean;
};

export type PostType = NonNullable<initialStateType['post']>;

const initialState: initialStateType = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    setPostAction: (state, actions: PayloadAction<PostType>) => ({
      ...state,
      post: actions.payload,
    }),
    setPostsAction: (state, actions: PayloadAction<PostType[]>) => ({
      ...state,
      posts: actions.payload,
    }),
    falseRedirectAction: (state) => ({
      ...state,
      redirect: false,
    }),
    deleteInfoAction: (state) => ({
      ...state,
      info: undefined,
    }),
  },
  extraReducers: {
    [createPostAction.fulfilled.type]: (
      state,
      actions: PayloadAction<PostType>,
    ) => ({
      ...state,
      posts: [
        {
          id: actions.payload.id,
          text: actions.payload.text,
          image: actions.payload.image,
        },
        ...state.posts,
      ],
      info: '投稿しました',
      redirect: true,
    }),
    [createPostAction.rejected.type]: (
      state,
      actions: PayloadAction<string>,
    ) => ({
      ...state,
      errors: {invalidError: actions.payload},
    }),
  },
});

export const {
  setPostAction,
  setPostsAction,
  falseRedirectAction,
  deleteInfoAction,
} = postSlice.actions;

export default postSlice.reducer;
