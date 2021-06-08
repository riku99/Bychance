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
      flashStampsAdapter.addMany(state, action.payload.flasStamps);
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
  },
});

const flashStampsSelector = flashStampsAdapter.getSelectors();

export const selectFlashStampEntites = (state: RootState) =>
  flashStampsSelector.selectEntities(state.flashStampsReducer);

export const flashStampsReducer = flashStampsSlice.reducer;
