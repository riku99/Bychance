import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {createMessageThunk} from '../actions/messages';
import {subsequentLoginAction} from '../actions/users';
import {SuccessfullLoginData} from '../apis/users_api';
import {RootState} from './index';
import {Room} from './rooms';

export type MessageType = {
  id: number;
  roomId: number;
  userId: number;
  text: string;
  timestamp: string;
};

const messagesAdapter = createEntityAdapter<MessageType>({
  selectId: (message) => message.id,
  sortComparer: (a, b) =>
    new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [subsequentLoginAction.fulfilled.type]: (
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

export const selectLatestMessageEntities = (
  state: RootState,
  rooms: Room[],
) => {
  const _ms = messagesSelectors.selectEntities(state.messagesReducer);
  let latestMessageEntities: {[key: number]: MessageType} = {};
  for (let room of rooms) {
    const latestMessage = room.messages[0];
    const message = _ms[latestMessage];
    if (message) {
      latestMessageEntities[latestMessage] = message;
    }
  }
  return latestMessageEntities;
};

export const messagesReducer = messagesSlice.reducer;
