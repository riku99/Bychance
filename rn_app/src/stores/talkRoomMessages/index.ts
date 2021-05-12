import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {
  createMessageThunk,
  CreateMessageThunkPayload,
} from '../../apis/talkRoomMessages/createTalkRoomMessage';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
} from '../../apis/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../apis/session/sessionLogin';
import {sampleLogin} from '../../apis/session/sampleLogin';
import {logoutAction} from '../../apis/session/logout';
import {RootState} from '../index';
import {ReceivedMessageData} from '../types';

export type TalkRoomMessage = {
  id: number;
  roomId: number;
  userId: number;
  text: string;
  timestamp: string;
  read: boolean;
};

const talkRoomMessagesAdapter = createEntityAdapter<TalkRoomMessage>({
  selectId: (message) => message.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1,
});

const talkRoomMessagesSlice = createSlice({
  name: 'messages',
  initialState: talkRoomMessagesAdapter.getInitialState(),
  reducers: {
    receiveTalkRoomMessage: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      talkRoomMessagesAdapter.addOne(state, action.payload.message);
    },
  },
  extraReducers: {
    [logoutAction.type]: () => {
      return talkRoomMessagesAdapter.getInitialState();
    },
    [sampleLogin.fulfilled.type]: (state, action) => {
      talkRoomMessagesAdapter.addMany(state, action.payload.messages);
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      talkRoomMessagesAdapter.addMany(state, action.payload.messages);
    },
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      talkRoomMessagesAdapter.addMany(state, action.payload.messages);
    },
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateMessageThunkPayload>,
    ) => {
      talkRoomMessagesAdapter.addOne(state, action.payload.message);
    },
  },
});

const talkRoomMessageSelectors = talkRoomMessagesAdapter.getSelectors();

export const selectMessages = (state: RootState, messageIds: number[]) => {
  const _ms = [];
  for (let i of messageIds) {
    const message = talkRoomMessageSelectors.selectById(
      state.talkRoomMessageReducer,
      i,
    );
    message && _ms.push(message);
  }
  return _ms;
};

export const {receiveTalkRoomMessage} = talkRoomMessagesSlice.actions;

export const talkRoomMessageReducer = talkRoomMessagesSlice.reducer;
