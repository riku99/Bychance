import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {User} from '~/types/store/_users';

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
