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
  getNearbyUsersThunk,
  GetNearbyUsersPayload,
} from '../thunks/nearbyUsers/getNearbyUsers';
import {
  createRoomThunk,
  CreateRoomThunkPayload,
} from '../thunks/rooms/createTalkRoom';
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
    setChatPartner: (state, action: PayloadAction<AnotherUser>) => {
      chatPartnersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    resetChatPartners: () => chatPartnersAdapter.getInitialState(),
  },
  extraReducers: {
    [createRoomThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateRoomThunkPayload>,
    ) => {
      if (!action.payload.presence) {
        chatPartnersAdapter.addOne(state, action.payload.partner);
      }
    },
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
    [getNearbyUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GetNearbyUsersPayload>,
    ) => {
      const result = action.payload;
      const forUpdateArray: {id: string; changes: AnotherUser}[] = [];
      const ids = selectIds(state);
      ids.forEach((n) => {
        const target = result.usersData.find((data) => data.id === n);
        if (target) {
          const updateObj = {id: target.id, changes: target};
          forUpdateArray.push(updateObj);
        }
      });
      chatPartnersAdapter.updateMany(state, forUpdateArray);
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

const selectIds = (state: RootState['chatPartnersReducer']) =>
  chatPartnersSelector.selectIds(state);

export const chatPartnersReducer = chatPartnersSlice.reducer;

export const {
  setChatPartners,
  setChatPartner,
  resetChatPartners,
} = chatPartnersSlice.actions;
