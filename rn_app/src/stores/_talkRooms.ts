import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';

export type TalkRoom = {
  id: number;
  timestamp: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string;
    userId: string;
    createdAt: string;
  } | null;
  partner: {
    id: string;
  };
};

const talkRoomsAdapter = createEntityAdapter<TalkRoom>({
  selectId: (r) => r.id,
  sortComparer: (a, b) =>
    new Date(a.lastMessage ? a.lastMessage.createdAt : a.timestamp) <
    new Date(b.lastMessage ? b.lastMessage?.createdAt : b.timestamp)
      ? 1
      : -1, // 更新日時を基準に降順
});

export const TalkRoomSlice = createSlice({
  name: 'taklRooms',
  initialState: talkRoomsAdapter.getInitialState(),
  reducers: {
    setTalkRooms: (state, action: PayloadAction<TalkRoom[]>) => {
      talkRoomsAdapter.setMany(state, action.payload);
    },
    updateTalkRoom: (
      state,
      action: PayloadAction<{id: number; changes: Partial<TalkRoom>}>,
    ) => {
      const {id, changes} = action.payload;
      talkRoomsAdapter.updateOne(state, {
        id,
        changes,
      });
    },
    addTalkRoom: (state, action: PayloadAction<TalkRoom>) => {
      talkRoomsAdapter.addOne(state, action);
    },
    removeTalkRoom: (state, action: PayloadAction<number>) => {
      talkRoomsAdapter.removeOne(state, action.payload);
    },
    upsertTalkRoom: (state, action: PayloadAction<TalkRoom>) => {
      talkRoomsAdapter.upsertOne(state, action.payload);
    },
    resetTalkRooms: () => talkRoomsAdapter.getInitialState(),
  },
});

export const _talkRoomReducer = TalkRoomSlice.reducer;

export const {
  setTalkRooms,
  updateTalkRoom,
  addTalkRoom,
  removeTalkRoom,
  upsertTalkRoom,
  resetTalkRooms,
} = TalkRoomSlice.actions;

const selectors = talkRoomsAdapter.getSelectors();

export const selectAllTalkRooms = (state: RootState) =>
  selectors.selectAll(state._talkRoomReducer);

export const selectRoom = (state: RootState, id: number) =>
  selectors.selectById(state._talkRoomReducer, id);
