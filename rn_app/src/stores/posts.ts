import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '.';

export type Post = {
  id: number;
  text: string;
  url: string;
  sourceType: 'image' | 'video';
  date: string;
  userId: string;
};

const postsAdaper = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.id - a.id,
});

export type PostsAdapter = typeof postsAdaper;

export type PostsState = ReturnType<typeof postsAdaper.getInitialState>;

const postSlice = createSlice({
  name: 'post',
  initialState: postsAdaper.getInitialState(),
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      postsAdaper.upsertMany(state, action.payload);
    },
    resetPosts: () => {
      return postsAdaper.getInitialState();
    },
    addPost: (state, action: PayloadAction<Post>) => {
      postsAdaper.addOne(state, action.payload);
    },
    removePost: (state, action: PayloadAction<number>) => {
      postsAdaper.removeOne(state, action.payload);
    },
  },
});

const postsSlectors = postsAdaper.getSelectors();

export const selectAllPosts = (state: RootState) => {
  return postsSlectors.selectAll(state.postsReducer);
};

export const postsReducer = postSlice.reducer;

export const {setPosts, resetPosts, addPost, removePost} = postSlice.actions;
