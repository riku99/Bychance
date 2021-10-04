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

// アプリ内で使われる一部のユーザー情報はここに入り、ここから参照される。例えば近くのユーザーとかトーク相手とか。
// これは変更を検知したら同期させたいからである。
//　例えば近くのユーザーからユーザーAのページに飛ぶ。そこでリフレッシュが起こり名前がAからBに更新される。近くのユーザーページに戻るとそこでも更新している状態にしたい。また、既にトークしている場合はそのトーク画面に表示されている情報も更新したい。このような変更の同期のためにこのスライスにデータの一部を入れ参照するようにしている。
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
    resetUsers: () => usersAdapter.getInitialState(),
  },
});

export const _usersReducer = UsersSlice.reducer;

export const {upsertUsers, updateUser, resetUsers} = UsersSlice.actions;

const selectors = usersAdapter.getSelectors();

export const selectUserAvatar = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.avatar;

export const selectUserName = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.name;

export const selectUserBlock = (state: RootState, id: string) =>
  selectors.selectById(state._usersReducer, id)?.block;
