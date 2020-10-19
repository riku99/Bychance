import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//import {loginErrorThunk} from '../actions/index';
import {createPostAction, deletePostAsync} from '../actions/posts';

type initialStateType = {
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

export type PostType = initialStateType['posts'][number];

const initialState: initialStateType = {
  posts: [],
};

type rejectedType = {
  invalid?: string;
  loginError?: boolean;
  someError?: boolean;
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
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
    // registerエラーが出た時これの行消してみる
    //[loginErrorThunk.fulfilled.type]: () => initialState,
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
      actions: PayloadAction<rejectedType>,
    ) => {
      if (actions.payload.invalid) {
        return {
          ...state,
          errors: {invalidError: actions.payload.invalid},
        };
      }
    },
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
      actions: PayloadAction<rejectedType>,
    ) => {
      if (actions.payload.invalid) {
        return {
          ...state,
          errors: {invalidError: actions.payload.invalid},
        };
      }
    },
  },
});

export const {
  setPostsAction,
  falseRedirectAction,
  deleteInfoAction,
  deleteInvalidAction,
  setProcessAction,
} = postSlice.actions;

export default postSlice.reducer;
