import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {
  createPostThunk,
  CreatePostThunkPayload,
} from '../../apis/posts/createPost';
import {
  deletePostThunk,
  DeletePostThunkPaylaod,
} from '../../apis/posts/deletePost';
import {logoutThunk} from '~/apis/session/logout';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
} from '../../apis/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../apis/session/sessionLogin';
import {sampleLogin} from '../../apis/session/sampleLogin';
import {RootState} from '..';
import {refreshUser} from '~/stores/helpers/refreshUser';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '~/apis/users/refreshUser';

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
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: (state, action) => {
      postsAdaper.addMany(state, action.payload.posts);
    },
    [logoutThunk.fulfilled.type]: () => {
      return postsAdaper.getInitialState();
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      postsAdaper.addMany(state, action.payload.posts);
    },
    // ExceptionsManager.js:179 Invariant Violation: Module AppRegistry is not a registered callable moduleが解決できないので文字列で直接指定
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      postsAdaper.addMany(state, action.payload.posts);
    },
    [createPostThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreatePostThunkPayload>,
    ) => {
      postsAdaper.addOne(state, action.payload);
    },
    [deletePostThunk.fulfilled.type]: (
      state,
      action: PayloadAction<DeletePostThunkPaylaod>,
    ) => {
      postsAdaper.removeOne(state, action.payload);
    },
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<RefreshUserThunkPaylaod>,
    ) => {
      refreshUser({
        slice: 'post',
        state,
        adaper: postsAdaper,
        action: action,
      });
    },
  },
});

const postsSlectors = postsAdaper.getSelectors();

export const selectAllPosts = (state: RootState) => {
  return postsSlectors.selectAll(state.postsReducer);
};

export const postsReducer = postSlice.reducer;
