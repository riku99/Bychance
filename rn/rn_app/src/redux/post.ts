import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createPostAction, deletePostAsync} from '../actions/posts_action';

type initialStateType = {
  post?: {
    id: number;
    text: string;
    image: string;
    date: string;
    userID: number;
  };
  posts: {
    id: number;
    text: string;
    image: string;
    date: string;
    userID: number;
  }[];
  info?: string;
  errors?: {invalidError?: string};
  redirect?: boolean;
  process?: boolean;
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
    deleteInvalidAction: (state) => ({
      ...state,
      errors: {invalidError: undefined},
    }),
    setProcessAction: (state) => ({
      ...state,
      process: true,
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
          date: actions.payload.date,
          userID: actions.payload.userID,
        },
        ...state.posts,
      ],
      info: '投稿しました',
      process: false,
    }),
    [createPostAction.rejected.type]: (
      state,
      actions: PayloadAction<string>,
    ) => ({
      ...state,
      errors: {invalidError: actions.payload},
    }),
    [deletePostAsync.fulfilled.type]: (
      state,
      actions: PayloadAction<number>,
    ) => {
      let array = state.posts.filter((v) => {
        if (v.id !== actions.payload) {
          return v;
        }
      });
      return {
        ...state,
        posts: array,
        info: '削除しました',
      };
    },
    [deletePostAsync.rejected.type]: (
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
  deleteInvalidAction,
  setProcessAction,
} = postSlice.actions;

export default postSlice.reducer;
