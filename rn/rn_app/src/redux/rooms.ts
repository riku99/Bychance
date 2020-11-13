import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {createRoomThunk} from '../actions/rooms';
import {OtherUserType} from './others';
import {RootState, store} from './index';
import {subsequentLoginAction, firstLoginThunk} from '../actions/users';
import {createMessageThunk} from '../actions/messages';
import {MessageType} from '../redux/messages';
import {SuccessfullLoginData} from '../apis/usersApi';

export type Room = {
  id: number;
  partner: OtherUserType; // ここもOthersを正規化した後Id参照にする。?
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
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    [subsequentLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      roomsAdapter.addMany(state, action.payload.rooms);
    },
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        | {
            id: number;
            recipient: OtherUserType;
            presence: false;
            timestamp: string;
          }
        | {id: number; presence: true}
      >,
    ) => {
      if (!action.payload.presence) {
        roomsAdapter.addOne(state, {
          id: action.payload.id,
          partner: action.payload.recipient,
          timestamp: action.payload.timestamp,
          messages: [],
        });
      }
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
  },
});

const roomSelectors = roomsAdapter.getSelectors();

export const selectRoom = (n: number) => {
  return roomSelectors.selectById(store.getState().roomsReducer, n);
};

export const selectAllRooms = (state: RootState) => {
  return roomSelectors.selectAll(state.roomsReducer);
};

export const selectMessageIds = (state: RootState, roomId: number) => {
  const room = selectRoom(roomId);
  return room!.messages;
};

export const roomsReducer = RoomsSlice.reducer;
