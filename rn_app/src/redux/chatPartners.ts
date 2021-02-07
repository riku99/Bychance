import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {
  subsequentLoginThunk,
  firstLoginThunk,
  sampleLogin,
} from '../actions/users';
import {logoutAction} from '../actions/sessions';
import {SuccessfullLoginData} from '../actions/d';
import {RootState} from './index';
import {AnotherUser} from './getUsers';

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
  },
});

const chatPartnersSelector = chatPartnersAdapter.getSelectors();

export const selectChatPartnerEntities = (state: RootState) => {
  return chatPartnersSelector.selectEntities(state.chatPartnersReducer);
};

export const chatPartnersReducer = chatPartnersSlice.reducer;
