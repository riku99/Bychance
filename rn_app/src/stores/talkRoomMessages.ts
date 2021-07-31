import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {
  createMessageThunk,
  CreateMessageThunkPayload,
} from '../thunks/talkRoomMessages/createTalkRoomMessage';
import {RootState} from './index';
import {ReceivedMessageData} from './types';

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
    setTalkRoomMessages: (state, action: PayloadAction<TalkRoomMessage[]>) => {
      talkRoomMessagesAdapter.upsertMany(state, action.payload);
    },
    resetTalkRoomMessages: () => talkRoomMessagesAdapter.getInitialState(),
    receiveTalkRoomMessage: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      talkRoomMessagesAdapter.addOne(state, action.payload.message);
    },
  },
  extraReducers: {
    [createMessageThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateMessageThunkPayload>,
    ) => {
      if (action.payload.talkRoomPresence) {
        talkRoomMessagesAdapter.addOne(state, action.payload.message);
      }
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

export const {
  receiveTalkRoomMessage,
  setTalkRoomMessages,
  resetTalkRoomMessages,
} = talkRoomMessagesSlice.actions;

export const talkRoomMessageReducer = talkRoomMessagesSlice.reducer;
