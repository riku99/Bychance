import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {AnotherUser, ReceivedMessageData} from './types';
import {RootState} from './index';
import {receiveMessage} from './messages';
import {User} from './user';
import {
  subsequentLoginThunk,
  firstLoginThunk,
  sampleLogin,
} from '../actions/users';
import {logoutAction} from '../actions/sessions';
import {SuccessfullLoginData} from '../actions/types';
import {createRoomThunk} from '../actions/rooms';
import {refreshUserThunk} from '../actions/users';

const chatPartnersAdapter = createEntityAdapter<AnotherUser>({});

export type chatPartnerEntities = ReturnType<
  typeof chatPartnersAdapter['getInitialState']
>['entities'];

export const chatPartnersSlice = createSlice({
  name: 'chatPartners',
  initialState: chatPartnersAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [sampleLogin.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => chatPartnersAdapter.setAll(state, action.payload.chatPartners),
    [logoutAction.type]: () => {
      chatPartnersAdapter.getInitialState();
    },
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => chatPartnersAdapter.setAll(state, action.payload.chatPartners),
    [subsequentLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => chatPartnersAdapter.setAll(state, action.payload.chatPartners),
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{
        presence: boolean;
        roomId: number;
        partner: AnotherUser;
        timestamp: string;
      }>,
    ) => {
      if (!action.payload.presence) {
        chatPartnersAdapter.addOne(state, action.payload.partner);
      }
    },
    [receiveMessage.type]: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      chatPartnersAdapter.upsertOne(state, action.payload.sender);
    },
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<
        {isMyData: true; data: User} | {isMyData: false; data: AnotherUser}
      >,
    ) => {
      if (!action.payload.isMyData) {
        return chatPartnersAdapter.updateOne(state, {
          id: action.payload.data.id,
          changes: action.payload.data,
        });
      }
    },
  },
});

const chatPartnersSelector = chatPartnersAdapter.getSelectors();

export const selectChatPartnerEntities = (state: RootState) => {
  return chatPartnersSelector.selectEntities(state.chatPartnersReducer);
};

export const selectChatPartner = (state: RootState, partnerId: number) =>
  chatPartnersSelector.selectById(state.chatPartnersReducer, partnerId);

export const chatPartnersReducer = chatPartnersSlice.reducer;
