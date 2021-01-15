import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {createMessageThunk, changeMessagesReadThunk} from '../actions/messages';
import {
  subsequentLoginThunk,
  firstLoginThunk,
  sampleLogin,
} from '../actions/users';
import {logoutAction} from '../actions/sessions';
import {SuccessfullLoginData} from '../apis/usersApi';
import {RootState} from './index';
import {Room} from './rooms';

export type MessageType = {
  id: number;
  roomId: number;
  userId: number;
  text: string;
  timestamp: string;
  read: boolean;
};

const messagesAdapter = createEntityAdapter<MessageType>({
  selectId: (message) => message.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    recieveMessage: (
      state,
      action: PayloadAction<{room: Room; message: MessageType}>,
    ) => {
      messagesAdapter.addOne(state, action.payload.message);
    },
  },
  extraReducers: {
    [logoutAction.type]: () => {
      return messagesAdapter.getInitialState();
    },
    [sampleLogin.fulfilled.type]: (state, action) => {
      messagesAdapter.addMany(state, action.payload.messages);
    },
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      messagesAdapter.addMany(state, action.payload.messages);
    },
    [subsequentLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      messagesAdapter.addMany(state, action.payload.messages);
    },
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{message: MessageType; room: number}>,
    ) => {
      messagesAdapter.addOne(state, action.payload.message);
    },
    [changeMessagesReadThunk.fulfilled.type]: (
      state,
      action: PayloadAction<MessageType[]>,
    ) => {
      messagesAdapter.upsertMany(state, action.payload);
    },
  },
});

const messagesSelectors = messagesAdapter.getSelectors();

export const selectMessages = (state: RootState, messageIds: number[]) => {
  const _ms = [];
  for (let i of messageIds) {
    const message = messagesSelectors.selectById(state.messagesReducer, i);
    message && _ms.push(message);
  }
  return _ms;
};

export const {recieveMessage} = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
