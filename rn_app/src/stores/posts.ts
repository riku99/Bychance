import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '.';

export type Post = {
  id: number;
  text: string | null;
  url: string;
  sourceType: 'image' | 'video';
  createdAt: string;
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
      postsAdaper.setMany(state, action.payload);
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
    upsertPosts: (state, action: PayloadAction<Post[]>) => {
      postsAdaper.upsertMany(state, action.payload);
    },
  },
});

export const postsReducer = postSlice.reducer;

export const {
  setPosts,
  resetPosts,
  addPost,
  removePost,
  upsertPosts,
} = postSlice.actions;

const selectors = postsAdaper.getSelectors();

export const getAllPosts = (state: RootState) =>
  selectors.selectAll(state.postsReducer);

export const selectPostsByUserid = (state: RootState, userId: string) => {
  const all = getAllPosts(state);
  return all.filter((a) => a.userId === userId);
};
