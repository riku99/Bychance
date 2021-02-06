import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {User} from './user';
import {Post} from './post';
import {FlashesData} from '../components/pages/Flashes/ShowFlash';
import {getOtherUsersThunk} from '../actions/otherUsers';

export type AnotherUser = Omit<User, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: FlashesData;
};

export type otherUsers = AnotherUser[];

// entityのユニークなプロパテがidの場合は指定する必要ない
// ソート方法もAPIから送られてきた通りなので指定しない
const otherUsersAdapter = createEntityAdapter<AnotherUser>();

const otherUsersSlice = createSlice({
  name: 'otherUsers',
  initialState: otherUsersAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getOtherUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<otherUsers>,
    ) => {
      return otherUsersAdapter.setAll(state, action.payload);
    },
  },
});

export const otherUsersReducer = otherUsersSlice.reducer;

const otherUsersSelectors = otherUsersAdapter.getSelectors();

export const selectOtherUsersArray = (state: RootState) =>
  otherUsersSelectors.selectAll(state.otherUsersReducer);
