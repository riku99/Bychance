import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {AnotherUser, ReceivedMessageData} from './types';
import {RootState} from './index';
import {receiveTalkRoomMessage} from './talkRoomMessages';
import {updateAlreadyViewed} from './helpers/createViewedFlashes';
import {
  createAlreadyViewdFlashThunk,
  CreateAlreadyViewdFlashThunkPayload,
} from '../thunks/flashes/createAlreadyViewedFlashes';

export const chatPartnersAdapter = createEntityAdapter<AnotherUser>({});

export type ChatPartnersState = ReturnType<
  typeof chatPartnersAdapter.getInitialState
>;

export const chatPartnersSlice = createSlice({
  name: 'chatPartners',
  initialState: chatPartnersAdapter.getInitialState(),
  reducers: {
    setChatPartners: (state, action: PayloadAction<AnotherUser[]>) => {
      chatPartnersAdapter.upsertMany(state, action.payload);
    },
    upsertChatPartner: (state, action: PayloadAction<AnotherUser>) => {
      chatPartnersAdapter.upsertOne(state, action.payload);
    },
    resetChatPartners: () => chatPartnersAdapter.getInitialState(),
    updateChatPartners: (
      state,
      action: PayloadAction<{id: string; changes: AnotherUser}[]>,
    ) => {
      chatPartnersAdapter.updateMany(state, action.payload);
    },
  },
  extraReducers: {
    [receiveTalkRoomMessage.type]: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      if (action.payload.isFirstMessage) {
        chatPartnersAdapter.upsertOne(state, action.payload.sender);
      }
    },
    [createAlreadyViewdFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateAlreadyViewdFlashThunkPayload>,
    ) => {
      updateAlreadyViewed(state, action, {slice: chatPartnersSlice.name});
    },
  },
});

const chatPartnersSelector = chatPartnersAdapter.getSelectors();

export type ReturnTypeOfSelectChatPartnerEntities = ReturnType<
  typeof selectChatPartnerEntities
>;
export const selectChatPartnerEntities = (state: RootState) => {
  return chatPartnersSelector.selectEntities(state.chatPartnersReducer);
};

export const selectChatPartner = (state: RootState, partnerId: string) => {
  return chatPartnersSelector.selectById(state.chatPartnersReducer, partnerId);
};

export const selectChatPartnerAlreadyViewed = (
  state: RootState,
  userId: string,
) => {
  const user = chatPartnersSelector.selectById(
    state.chatPartnersReducer,
    userId,
  );
  if (user) {
    return user.flashes.alreadyViewed;
  } else {
    // ユーザーがいない場合はそもそもselectChatPartnerAlreadyViewedが実行されない
    // なのでこのブロックが実行されることは基本的にない
    return [];
  }
};

export const selectChatPartnerIds = (state: RootState['chatPartnersReducer']) =>
  chatPartnersSelector.selectIds(state);

export const chatPartnersReducer = chatPartnersSlice.reducer;

export const {
  setChatPartners,
  upsertChatPartner,
  resetChatPartners,
  updateChatPartners,
} = chatPartnersSlice.actions;
