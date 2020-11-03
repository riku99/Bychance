import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createRoomThunk} from '../actions/chats';
import {OtherUserType} from './others';

export type ChatType = {room: Room; messages: Message[]};

export type Room = {id: number; partner: Omit<OtherUserType, 'message'>};

export type Message = {
  id: number;
  roomId: number;
  partnerId: number;
  text: string;
  date: string;
};

type InitialStateType = {
  chatLists?: ChatType[];
  currentChat?: ChatType | null;
};

const initialState: InitialStateType = {chatLists: [], currentChat: null};

const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {},
  extraReducers: {
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        (Room & {presence: false}) | {id: number; presence: true}
      >,
    ) => {
      console.log(action);
      if (action.payload.presence) {
        return {
          ...state,
          currentChat: state.chatLists?.find((chat) => {
            chat.room.id === action.payload.id;
          }),
        };
      } else {
        return {
          ...state,
          chatLists: [
            {
              room: {id: action.payload.id, partner: action.payload.partner},
              messages: [],
            },
            ...state.chatLists!,
          ],
          currentChat: {
            room: {id: action.payload.id, partner: action.payload.partner},
            messages: [],
          },
        };
      }
    },
  },
});

export default chatSlice.reducer;
