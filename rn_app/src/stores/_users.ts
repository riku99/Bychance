import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '.';

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  block: boolean;
};

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
    updateUser: (
      state,
      action: PayloadAction<{id: string; changes: Partial<User>}>,
    ) => {
      usersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      });
    },
  },
});

export const _usersReducer = UsersSlice.reducer;

export const {upsertUsers, updateUser} = UsersSlice.actions;

const selectors = usersAdapter.getSelectors();

export const selectUserAvatar = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.avatar;

export const selectUserName = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.name;

export const selectUserBlock = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.block;
