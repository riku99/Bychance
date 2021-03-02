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
  refreshUserThunk,
} from '../actions/users';
import {logoutAction} from '../actions/sessions';
import {SuccessfullLoginData} from '../actions/types';
import {createRoomThunk} from '../actions/rooms';
import {createAlreadyViewdFlashThunk} from '../actions/flashes';
import {getNearbyUsersThunk} from '../actions/nearbyUsers';
import {ReturnGetNearbyUsersThunk} from '../actions/nearbyUsers/types';

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
    [createAlreadyViewdFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{userId: number; flashId: number}>,
    ) => {
      const user = state.entities[action.payload.userId];
      if (user) {
        const viewdId = user.flashes.alreadyViewed.includes(
          action.payload.flashId,
        );
        if (!viewdId) {
          const f = user.flashes;
          const alreadyAllViewed =
            f.alreadyViewed.length + 1 === f.entities.length;
          const viewed = f.alreadyViewed;
          return chatPartnersAdapter.updateOne(state, {
            id: action.payload.userId,
            changes: {
              ...user,
              flashes: {
                ...f,
                alreadyViewed: [...viewed, action.payload.flashId],
                isAllAlreadyViewed: alreadyAllViewed,
              },
            },
          });
        }
      }
    },
    [getNearbyUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<ReturnGetNearbyUsersThunk>,
    ) => {
      const result = action.payload;
      const forUpdateArray: {id: number; changes: AnotherUser}[] = [];
      const ids = selectIds(state);
      ids.forEach((n) => {
        const target = result.find((data) => data.id === n);
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

export const selectChatPartnerEntities = (state: RootState) => {
  return chatPartnersSelector.selectEntities(state.chatPartnersReducer);
};

export const selectChatPartner = (state: RootState, partnerId: number) => {
  const user = chatPartnersSelector.selectById(
    state.chatPartnersReducer,
    partnerId,
  );
  if (user) {
    return user;
  } else {
    // エラーのスローではなくてAlertで対応できるようにする
    throw new Error();
  }
};

export const selectChatPartnerAlreadyViewed = (
  state: RootState,
  userId: number,
) => {
  const user = chatPartnersSelector.selectById(
    state.chatPartnersReducer,
    userId,
  );
  if (user) {
    return user.flashes.alreadyViewed;
  } else {
    throw new Error('not found user');
  }
};

const selectIds = (state: RootState['chatPartnersReducer']) =>
  chatPartnersSelector.selectIds(state);

export const chatPartnersReducer = chatPartnersSlice.reducer;
