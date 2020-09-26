import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createPostAction} from '../actions/posts_action';

type initialStateType = {
  posts: {id: number; text: string; image: string}[];
  info?: string;
  errors?: {invalidError: string};
  redirect?: boolean;
};

export type PostType = initialStateType['posts'][number];

const initialState: initialStateType = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
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
        ...state.posts,
        {
          id: actions.payload.id,
          text: actions.payload.text,
          image: actions.payload.image,
        },
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

export const {falseRedirectAction, deleteInfoAction} = postSlice.actions;

export default postSlice.reducer;
