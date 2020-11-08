import {createSlice, PayloadAction} from '@reduxjs/toolkit';

//import {loginErrorThunk} from '../actions/index';
import {createPostAction, deletePostThunk} from '../actions/posts';

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
    setPostsAction: (state, actions: PayloadAction<PostType[]>) => ({
      ...state,
      posts: actions.payload,
    }),
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

export const {
  setPostsAction,
  falseRedirectAction,
  setProcessAction,
} = postSlice.actions;

export default postSlice.reducer;
