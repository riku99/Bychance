import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {RNToasty} from 'react-native-toasty';

import {RootState} from './index';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
} from '../thunks/session/lineLogin';
import {sampleLogin} from '../thunks/session/sampleLogin';
import {
  createMessageThunk,
  CreateMessageThunkPayload,
} from '../thunks/talkRoomMessages/createTalkRoomMessage';
import {
  createRoomThunk,
  CreateRoomThunkPayload,
} from '../thunks/rooms/createTalkRoom';
import {
  createDeleteRoomThunk,
  CreateDeleteRoomThunkPayload,
} from '~/thunks/deleteTalkRooms/createDeleteTalkRoom';
import {logoutThunk} from '~/thunks/session/logout';
import {receiveTalkRoomMessage} from './talkRoomMessages';
import {ReceivedMessageData} from '~/stores/types';

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
      talkRoomsAdapter.addMany(state, action.payload);
    },
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
    [sampleLogin.fulfilled.type]: (state, action) => {
      talkRoomsAdapter.addMany(state, action.payload.rooms);
    },
    [logoutThunk.fulfilled.type]: () => {
      return talkRoomsAdapter.getInitialState();
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      talkRoomsAdapter.addMany(state, action.payload.rooms);
    },
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateRoomThunkPayload>,
    ) => {
      const data = action.payload;
      // トークルームがサーバー側でも存在しなかった場合(それが初めて作成された場合)、サーバー側では存在するがクライアント側には存在しない場合(作成した相手がメッセージを送っていない場合)はaddOneで新しく追加
      const targetTaklRoom = state.entities[data.roomId];
      if (!action.payload.presence || !targetTaklRoom) {
        talkRoomsAdapter.addOne(state, {
          id: data.roomId,
          partner: data.partner.id,
          timestamp: data.timestamp,
          messages: [],
          unreadNumber: 0,
          latestMessage: null,
        });
      }
    },
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateMessageThunkPayload>,
    ) => {
      const {talkRoomId} = action.payload;
      if (action.payload.talkRoomPresence) {
        const relatedRoom = state.entities[action.payload.talkRoomId];
        if (relatedRoom) {
          talkRoomsAdapter.updateOne(state, {
            id: talkRoomId,
            changes: {
              messages: [action.payload.message.id, ...relatedRoom.messages],
              timestamp: action.payload.message.timestamp,
              latestMessage: action.payload.message.text,
            },
          });
        }
      } else {
        // talkRoomPresenceがfalse、つまり既にトークルームが相手によって削除されている場合
        RNToasty.Show({
          title: 'メンバーが存在しません',
          position: 'center',
        });
        talkRoomsAdapter.updateOne(state, {
          id: talkRoomId,
          changes: {
            partner: undefined,
          },
        });
      }
    },
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
    [createDeleteRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateDeleteRoomThunkPayload>,
    ) => {
      talkRoomsAdapter.removeOne(state, action.payload.talkRoomId);
      // cahtPartners, talkRoomMessagesは削除このdispatchの時点で削除しないが、次回ロードの時には含まれないのでとりあえずそれでいい。
    },
  },
});

export const {resetUnreadNumber, setTalkRooms} = RoomsSlice.actions;

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
