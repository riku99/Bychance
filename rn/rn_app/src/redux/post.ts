import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createPostAction, deletePostThunk} from '../actions/posts';
import {SuccessfullLoginData} from '../apis/usersApi';
import {firstLoginThunk} from '../actions/users';

type initialStateType = {
  posts: {
    id: number;
    text: string;
    image: string;
    date: string;
    userId: number;
  }[];
};

export type PostType = initialStateType['posts'][number];

const initialState: initialStateType = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    // registerエラーが出た時これの行消してみる
    //[loginErrorThunk.fulfilled.type]: () => initialState,
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      return {
        ...state,
        posts: action.payload.posts,
      };
    },
    // ExceptionsManager.js:179 Invariant Violation: Module AppRegistry is not a registered callable moduleが解決できないので文字列で直接指定
    'users/subsequentLogin/fulfilled': (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      return {
        ...state,
        posts: action.payload.posts,
      };
    },
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
          userId: actions.payload.userId,
        },
        ...state.posts,
      ],
      process: false,
    }),
    [deletePostThunk.fulfilled.type]: (
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
      };
    },
  },
});

export const postsReducer = postSlice.reducer;
