import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {receiveTalkRoomMessage} from './talkRoomMessages';
import {ReceivedMessageData} from '~/stores/types';
import {TalkRoom} from '~/components/screens/TalkRoom/Chat';

export type TalkRoom = {
  id: number;
  partner: string;
  timestamp: string;
  messages: number[];
  unreadNumber: number;
  latestMessage: string | null;
};

const talkRoomsAdapter = createEntityAdapter<TalkRoom>({
  selectId: (room) => room.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1, // 更新日時を基準に降順
});

export const RoomsSlice = createSlice({
  name: 'rooms',
  initialState: talkRoomsAdapter.getInitialState(),
  reducers: {
    setTalkRooms: (state, action: PayloadAction<TalkRoom[]>) => {
      talkRoomsAdapter.upsertMany(state, action.payload);
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
      talkRoomsAdapter.addOne(state, action.payload);
    },
    removeTalkRoom: (state, action: PayloadAction<number>) => {
      talkRoomsAdapter.removeOne(state, action.payload);
    },
    resetTalkRooms: () => talkRoomsAdapter.getInitialState(),
    resetUnreadNumber: (state, actions: PayloadAction<{roomId: number}>) => {
      talkRoomsAdapter.updateOne(state, {
        id: actions.payload.roomId,
        changes: {
          unreadNumber: 0,
        },
      });
    },
  },
  extraReducers: {
    [receiveTalkRoomMessage.type]: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      if (action.payload.isFirstMessage) {
        // 受け取ったのが最初のメッセージだったらトークルームも存在しない状態なのでトークルームを追加
        talkRoomsAdapter.upsertOne(state, action.payload.room);
      } else {
        const {roomId, message} = action.payload;
        const targetRoom = state.entities[roomId];

        // 対象のルームないことは現在のところ基本的にないが、もし何らかの理由がなくてない場合stateは変えないでそのまま返す
        if (!targetRoom) {
          return state;
        }

        talkRoomsAdapter.updateOne(state, {
          id: action.payload.roomId,
          changes: {
            ...targetRoom,
            messages: [message.id, ...targetRoom.messages],
            unreadNumber: targetRoom.unreadNumber += 1,
            latestMessage: message.text,
          },
        });
      }
    },
  },
});

export const {
  resetUnreadNumber,
  setTalkRooms,
  resetTalkRooms,
  updateTalkRoom,
  addTalkRoom,
  removeTalkRoom,
} = RoomsSlice.actions;

export const talkRoomSelectors = talkRoomsAdapter.getSelectors();

export const selectRoom = (state: RootState, roomId: number) => {
  return talkRoomSelectors.selectById(state.talkRoomsReducer, roomId);
};

export const selectAllTalkRooms = (state: RootState) => {
  return talkRoomSelectors.selectAll(state.talkRoomsReducer);
};

export const getAllUnreadMessagesNumber = (state: RootState) => {
  const rooms = selectAllTalkRooms(state);
  let allunreadMessagesNumber = 0;
  for (let room of rooms) {
    allunreadMessagesNumber! += room.unreadNumber;
  }
  return allunreadMessagesNumber;
};

export const selectPartner = (state: RootState, roomId: number) => {
  const user = talkRoomSelectors.selectById(state.talkRoomsReducer, roomId)
    ?.partner;
  if (user) {
    return user;
  } else {
    throw new Error();
  }
};

export const talkRoomsReducer = RoomsSlice.reducer;
