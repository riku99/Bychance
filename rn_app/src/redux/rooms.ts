import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {createRoomThunk} from '../actions/rooms';
import {
  subsequentLoginThunk,
  firstLoginThunk,
  sampleLogin,
} from '../actions/users';
import {logoutAction} from '../actions/sessions';
import {createMessageThunk} from '../actions/messages';
import {MessageType, recieveMessage} from '../redux/messages';
import {SuccessfullLoginData} from '../apis/usersApi';
import {AnotherUser} from '../components/others/SearchOthers';

export type Room = {
  id: number;
  partner: AnotherUser;
  timestamp: string;
  messages: number[];
  unreadNumber: number;
  latestMessage?: string | null;
};

const roomsAdapter = createEntityAdapter<Room>({
  selectId: (room) => room.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1, // 更新日時を基準に降順
});

export const RoomsSlice = createSlice({
  name: 'rooms',
  initialState: roomsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: (state, action) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    [logoutAction.type]: () => {
      return roomsAdapter.getInitialState();
    },
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    [subsequentLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{
        id: number;
        recipient: AnotherUser;
        timestamp: string;
      }>,
    ) => {
      roomsAdapter.upsertOne(state, {
        id: action.payload.id,
        partner: action.payload.recipient,
        timestamp: action.payload.timestamp,
        messages: state.entities[action.payload.id]
          ? state.entities[action.payload.id]?.messages!
          : [],
        unreadNumber: state.entities[action.payload.id]?.unreadNumber!, // あとで直す
        latestMessage: null, // あとで直す
      });
    },
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{message: MessageType; room: number}>,
    ) => {
      const relatedRoom = state.entities[action.payload.room];
      if (relatedRoom) {
        roomsAdapter.updateOne(state, {
          id: action.payload.room,
          changes: {
            messages: [action.payload.message.id, ...relatedRoom.messages],
            timestamp: action.payload.message.timestamp,
          },
        });
      }
    },
    [recieveMessage.type]: (
      state,
      action: PayloadAction<{room: Room; message: MessageType}>,
    ) => {
      roomsAdapter.upsertOne(state, action.payload.room);
    },
  },
});

export const roomSelectors = roomsAdapter.getSelectors();

export const selectRoom = (state: RootState, n: number) => {
  return roomSelectors.selectById(state.roomsReducer, n);
};

export const selectAllRooms = (state: RootState) => {
  return roomSelectors.selectAll(state.roomsReducer);
};

export const getAllUnreadMessagesNumber = (state: RootState) => {
  const rooms = selectAllRooms(state);
  let allunreadMessagesNumber = 0;
  for (let room of rooms) {
    allunreadMessagesNumber! += room.unreadNumber;
  }
  return allunreadMessagesNumber;
};

export const roomsReducer = RoomsSlice.reducer;
