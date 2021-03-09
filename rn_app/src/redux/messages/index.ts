import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {createMessageThunk} from '../../actions/messages';
import {
  firstLoginThunk,
  FirstLoginThunkPayload,
} from '../../actions/session/firstLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../actions/session/sessionLogin';
import {sampleLogin} from '../../actions/session/sampleLogin';
import {logoutAction} from '../../actions/sessions';
import {RootState} from '../index';
import {ReceivedMessageData} from '../types';

export type Message = {
  id: number;
  roomId: number;
  userId: number;
  text: string;
  timestamp: string;
  read: boolean;
};

const messagesAdapter = createEntityAdapter<Message>({
  selectId: (message) => message.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    receiveMessage: (state, action: PayloadAction<ReceivedMessageData>) => {
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
      action: PayloadAction<FirstLoginThunkPayload>,
    ) => {
      messagesAdapter.addMany(state, action.payload.messages);
    },
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      messagesAdapter.addMany(state, action.payload.messages);
    },
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{message: Message; roomId: number}>,
    ) => {
      messagesAdapter.addOne(state, action.payload.message);
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

export const {receiveMessage} = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
