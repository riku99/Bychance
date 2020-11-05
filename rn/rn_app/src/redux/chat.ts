import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createRoomThunk} from '../actions/chats';
import {OtherUserType} from './others';
import {subsequentLoginAction} from '../actions/users';

export type ChatType = Room & {messages: Message[]};

export type Room = {id: number; partner: OtherUserType};

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
    [subsequentLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<{rooms: ChatType[]}>,
    ) => {
      return {
        ...state,
        chatLists: action.payload.rooms,
      };
    },
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        | {
            id: number;
            recipient: OtherUserType;
            presence: false;
          }
        | {id: number; presence: true}
      >,
    ) => {
      if (action.payload.presence) {
        return {
          ...state,
          currentChat: state.chatLists!.find((chat) => {
            return chat.id === action.payload.id;
          }),
        };
      } else {
        return {
          ...state,
          chatLists: [
            {
              id: action.payload.id,
              partner: action.payload.recipient,
              messages: [],
            },
            ...state.chatLists!,
          ],
          currentChat: {
            id: action.payload.id,
            partner: action.payload.recipient,
            messages: [],
          },
        };
      }
    },
  },
});

export default chatSlice.reducer;
