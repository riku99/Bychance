import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createPostAction} from '../actions/posts_action';

type initialStateType = {
  posts?: {id: number; text: string; image: string}[];
  info?: string;
};

export type PostType = NonNullable<initialStateType['posts']>[number];

const initialState: initialStateType = {};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [createPostAction.fulfilled.type]: (
      state,
      actions: PayloadAction<PostType>,
    ) => {
      console.log(actions.payload);
    },
  },
});

export default postSlice.reducer;
