import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {User} from './user';
import {AnotherUser} from './types';
import {getOtherUsersThunk} from '../actions/otherUsers';
import {refreshUserThunk} from '../actions/users';

export type GetUsers = AnotherUser[];

// entityのユニークなプロパテがidの場合は指定する必要ない
// ソート方法もAPIから送られてきた通りなので指定しない
const getUsersAdapter = createEntityAdapter<AnotherUser>();

const getUsersSlice = createSlice({
  name: 'otherUsers',
  initialState: getUsersAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getOtherUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GetUsers>,
    ) => {
      return getUsersAdapter.setAll(state, action.payload);
    },
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >,
    ) => {
      if (!action.payload.isMyData) {
        return getUsersAdapter.updateOne(state, {
          id: action.payload.data.id,
          changes: action.payload.data,
        });
      }
    },
  },
});

export const getUsersReducer = getUsersSlice.reducer;

const getUsersSelectors = getUsersAdapter.getSelectors();

export const selectGetUsersArray = (state: RootState) =>
  getUsersSelectors.selectAll(state.getUsersReducer);

export const selectAnotherUser = (
  state: RootState,
  userId: number,
): AnotherUser => {
  const user = getUsersSelectors.selectById(state.getUsersReducer, userId);
  if (user) {
    return user;
  } else {
    throw new Error('not found user');
  }
};
