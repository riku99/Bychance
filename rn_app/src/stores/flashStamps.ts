import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';

import {RootState} from './index';

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
  reducers: {
    setFlashStamps: (state, action: PayloadAction<FlashStamp[]>) => {
      flashStampsAdapter.upsertMany(state, action.payload);
    },
    updateFlashStamp: (
      state,
      action: PayloadAction<{id: number; changes: FlashStamp}>,
    ) => {
      flashStampsAdapter.updateOne(state, action.payload);
    },
    addFlashStamp: (state, action: PayloadAction<FlashStamp>) => {
      flashStampsAdapter.addOne(state, action.payload);
    },
    resetFlashStamps: () => flashStampsAdapter.getInitialState(),
  },
});

const flashStampsSelector = flashStampsAdapter.getSelectors();

export const selectFlashStampEntites = (state: RootState) =>
  flashStampsSelector.selectEntities(state.flashStampsReducer);

export const selectFlashStamp = (state: RootState, id: number) =>
  flashStampsSelector.selectById(state.flashStampsReducer, id);

export const flashStampsReducer = flashStampsSlice.reducer;

export const {
  setFlashStamps,
  resetFlashStamps,
  updateFlashStamp,
  addFlashStamp,
} = flashStampsSlice.actions;
