import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '../index';
import {User} from '../user';
import {AnotherUser} from '../types';
import {updateAlreadyViewed} from '../helpers/createAlreadyViewedFlash';
import {getNearbyUsersThunk} from '../../actions/nearbyUsers';
import {ReturnGetNearbyUsersThunk} from '../../actions/nearbyUsers/types';
import {refreshUserThunk} from '../../actions/users';
import {createAlreadyViewdFlashThunk} from '../../actions/flashes';

export type NearbyUsers = AnotherUser[];

// entityのユニークなプロパテがidの場合は指定する必要ない
// ソート方法もAPIから送られてきた通りなので指定しない
export const nearbyUsersAdapter = createEntityAdapter<AnotherUser>();

const nearbyUsersSlice = createSlice({
  name: 'nearbyUsers',
  initialState: nearbyUsersAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getNearbyUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<ReturnGetNearbyUsersThunk>,
    ) => {
      return nearbyUsersAdapter.setAll(state, action.payload);
    },
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >,
    ) => {
      if (!action.payload.isMyData) {
        return nearbyUsersAdapter.updateOne(state, {
          id: action.payload.data.id,
          changes: action.payload.data,
        });
      }
    },
    [createAlreadyViewdFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{userId: number; flashId: number}>,
    ) => {
      updateAlreadyViewed(state, action, {slice: nearbyUsersSlice.name});
    },
  },
});

export const nearbyUsersReducer = nearbyUsersSlice.reducer;

const nearbyUsersSelector = nearbyUsersAdapter.getSelectors();

export const selectNearbyUsersArray = (state: RootState) =>
  nearbyUsersSelector.selectAll(state.nearbyUsersReducer);

export const selectNearbyUser = (
  state: RootState,
  userId: number,
): AnotherUser => {
  const user = nearbyUsersSelector.selectById(state.nearbyUsersReducer, userId);
  if (user) {
    return user;
  } else {
    // エラーのスローではなくてAlertで対応させる
    throw new Error('not found user');
  }
};

export const selectNearbyUserAlreadyViewed = (
  state: RootState,
  userId: number,
) => {
  const user = nearbyUsersSelector.selectById(state.nearbyUsersReducer, userId);
  if (user) {
    return user.flashes.alreadyViewed;
  } else {
    throw new Error('not found user');
  }
};
