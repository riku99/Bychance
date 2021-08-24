import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {User} from '~/types/store/_users';
import {RootState} from '.';

const usersAdapter = createEntityAdapter<User>({
  selectId: (u) => u.id,
});

const UsersSlice = createSlice({
  name: '_users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    upsertUsers: (state, action: PayloadAction<User[]>) => {
      usersAdapter.upsertMany(state, action.payload);
    },
  },
});

export const _usersReducer = UsersSlice.reducer;

export const {upsertUsers} = UsersSlice.actions;

const selectors = usersAdapter.getSelectors();

export const selectUserAvatar = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.avatar;
