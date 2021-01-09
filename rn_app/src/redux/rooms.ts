import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {createRoomThunk} from '../actions/rooms';
import {AnotherUser} from '../components/others/SearchOthers';
import {
  subsequentLoginThunk,
  firstLoginThunk,
  sampleLogin,
} from '../actions/users';
import {createMessageThunk} from '../actions/messages';
import {MessageType, recieveMessage} from '../redux/messages';
import {SuccessfullLoginData} from '../apis/usersApi';

export type Room = {
  id: number;
  partner: AnotherUser;
  timestamp: string;
  messages: number[];
};

const roomsAdapter = createEntityAdapter<Room>({
  selectId: (room) => room.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1,
});

export const RoomsSlice = createSlice({
  name: 'rooms',
  initialState: roomsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: (state, action) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    'index/logout': () => {
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

export const roomsReducer = RoomsSlice.reducer;
