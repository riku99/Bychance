import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//import {loginErrorThunk} from '../actions/index';
import {createPostAction, deletePostThunk} from '../actions/posts';
//import {subsequentLoginAction} from '../actions/users';
import {SuccessfullLoginData} from '../apis/users_api';

type initialStateType = {
  posts: {
    id: number;
    text: string;
    image: string;
    date: string;
    userId: number;
  }[];
  errors?: {};
  redirect?: boolean;
  process?: boolean;
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
    setProcessAction: (state) => ({
      ...state,
      process: true,
    }),
  },
  extraReducers: {
    // registerエラーが出た時これの行消してみる
    //[loginErrorThunk.fulfilled.type]: () => initialState,
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

export const {falseRedirectAction, setProcessAction} = postSlice.actions;

export const postsReducer = postSlice.reducer;
