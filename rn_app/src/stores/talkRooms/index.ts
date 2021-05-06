import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from '../index';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
} from '../../actions/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../actions/session/sessionLogin';
import {sampleLogin} from '../../actions/session/sampleLogin';
import {
  createMessageThunk,
  CreateMessageThunkPayload,
} from '../../actions/talkRoomMessages/createMessage';
import {
  createRoomThunk,
  CreateRoomThunkPayload,
} from '../../actions/rooms/createTalkRoom';
import {logoutAction} from '../../actions/session/logout';
import {Message, receiveMessage} from '../messages';

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
    [logoutAction.type]: () => {
      return talkRoomsAdapter.getInitialState();
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      talkRoomsAdapter.addMany(state, action.payload.rooms);
    },
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      talkRoomsAdapter.addMany(state, action.payload.rooms);
    },
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateRoomThunkPayload>,
    ) => {
      // const room = state.entities[action.payload.roomId];
      // roomが存在する場合は何もしなくていい。upsertOneの必要ない
      // なかったら新しくaddする。messageとunreadNumberとlatestMessageはなしで。
      if (!action.payload.presence) {
        const data = action.payload;
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
      const relatedRoom = state.entities[action.payload.roomId];
      if (relatedRoom) {
        talkRoomsAdapter.updateOne(state, {
          id: action.payload.roomId,
          changes: {
            messages: [action.payload.message.id, ...relatedRoom.messages],
            timestamp: action.payload.message.timestamp,
            latestMessage: action.payload.message.text,
          },
        });
      }
    },
    [receiveMessage.type]: (
      state,
      action: PayloadAction<{room: TalkRoom; message: Message}>,
    ) => {
      talkRoomsAdapter.upsertOne(state, action.payload.room);
    },
  },
});

export const {resetUnreadNumber} = RoomsSlice.actions;

export const talkRoomSelectors = talkRoomsAdapter.getSelectors();

export const selectRoom = (state: RootState, roomId: number) => {
  return talkRoomSelectors.selectById(state.talkRoomsReducer, roomId);
};

export const selectAllRooms = (state: RootState) => {
  return talkRoomSelectors.selectAll(state.talkRoomsReducer);
};

export const getAllUnreadMessagesNumber = (state: RootState) => {
  const rooms = selectAllRooms(state);
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
