import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {TalkRoom} from '~/types/store/talkRooms';
import {RootState} from './index';

const talkRoomsAdapter = createEntityAdapter<TalkRoom>({
  selectId: (r) => r.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1, // 更新日時を基準に降順
});

export const TalkRoomSlice = createSlice({
  name: 'taklRooms',
  initialState: talkRoomsAdapter.getInitialState(),
  reducers: {
    setTalkRooms: (state, action: PayloadAction<TalkRoom[]>) => {
      talkRoomsAdapter.setMany(state, action.payload);
    },
  },
});

export const _talkRoomReducer = TalkRoomSlice.reducer;

export const {setTalkRooms} = TalkRoomSlice.actions;

const selectors = talkRoomsAdapter.getSelectors();

export const selectAllTalkRooms = (state: RootState) =>
  selectors.selectAll(state._talkRoomReducer);
