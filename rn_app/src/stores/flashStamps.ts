import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {
  CreateFlashStampPayload,
  createFlashStampThunk,
} from '~/apis/flashStamps/createFlashStamp';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '~/apis/session/sessionLogin';
import {lineLoginThunk, LineLoginThunkPayload} from '../apis/session/lineLogin';
import {
  getNearbyUsersThunk,
  GetNearbyUsersPayload,
} from '~/apis/nearbyUsers/getNearbyUsers';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '~/apis/users/refreshUser';

export type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai'; // 随時変更される可能性あり

type FlashStampData = Record<
  StampValues,
  {
    number: number;
    userIds: string[];
  }
>;

export type FlashStamp = {
  flashId: number;
  data: FlashStampData;
};

const flashStampsAdapter = createEntityAdapter<FlashStamp>({
  selectId: (stamp) => stamp.flashId,
});

const flashStampsSlice = createSlice({
  name: 'flashStamps',
  initialState: flashStampsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      flashStampsAdapter.addMany(state, action.payload.flashStamps);
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      flashStampsAdapter.addMany(state, action.payload.flashStamps);
    },
    [createFlashStampThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateFlashStampPayload>,
    ) => {
      const {flashId, value, userId} = action.payload;
      const targetData = state.entities[flashId];
      if (targetData) {
        const targetValue = targetData.data[value];
        if (targetValue) {
          flashStampsAdapter.updateOne(state, {
            id: flashId,
            changes: {
              flashId: targetData.flashId,
              data: {
                ...targetData.data,
                [value]: {
                  number: targetValue.number += 1,
                  userIds: [...targetValue.userIds, userId],
                },
              },
            },
          });
        }
      }
    },
    [getNearbyUsersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GetNearbyUsersPayload>,
    ) => {
      flashStampsAdapter.upsertMany(state, action.payload.flashStampsData);
    },
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<RefreshUserThunkPaylaod>,
    ) => {
      if (action.payload.isMyData) {
        flashStampsAdapter.upsertMany(state, action.payload.flashStamps);
      } else {
        flashStampsAdapter.upsertMany(state, action.payload.data.flashStamps);
      }
    },
  },
});

const flashStampsSelector = flashStampsAdapter.getSelectors();

export const selectFlashStampEntites = (state: RootState) =>
  flashStampsSelector.selectEntities(state.flashStampsReducer);

export const flashStampsReducer = flashStampsSlice.reducer;
