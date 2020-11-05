import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {createRoomThunk, createMessageThunk} from '../actions/chats';
import {OtherUserType} from './others';
import {subsequentLoginAction} from '../actions/users';

export type ChatType = Room & {messages: MessageType[]};

export type Room = {id: number; partner: OtherUserType};

export type MessageType = {
  id: number;
  roomId: number;
  userId: number;
  text: string;
  timestamp: string;
};

type InitialStateType = {
  chatLists?: ChatType[];
  currentChat?: ChatType;
};

const initialState: InitialStateType = {chatLists: []};

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
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<MessageType>,
    ) => {
      const otherChats = state.chatLists!.filter((c) => {
        return c.id !== action.payload.roomId;
      });

      return {
        ...state,
        chatLists: [
          {
            ...state.currentChat!,
            messages: [action.payload, ...state.currentChat!.messages],
          },
          ...otherChats,
        ],
        currentChat: {
          ...state.currentChat!,
          messages: [action.payload, ...state.currentChat!.messages],
        },
      };
    },
  },
});

export default chatSlice.reducer;
