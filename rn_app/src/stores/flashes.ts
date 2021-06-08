import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';
import {
  deleteFlashThunk,
  DeleteFlashThunkPayload,
} from '../apis/flashes/deleteFlash';
import {
  createFlashThunk,
  CreateFlashThunkPaylaod,
} from '../apis/flashes/createFlash';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
  //sampleLogin,
} from '../apis/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../apis/session/sessionLogin';
import {logoutThunk} from '~/apis/session/logout';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '~/apis/users/refreshUser';
import {refreshUser} from '~/stores/helpers/refreshUser';
import {
  createFlashStampThunk,
  CreateFlashStampPayload,
} from '~/apis/flashStamps/createFlashStamp';

// export type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai';

// type FlashStampData = Record<
//   StampValues,
//   {
//     number: number;
//     userIds: string[];
//   }
// >;

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  timestamp: string;
  viewsNumber: number;
  // stamps: FlashStampData;
};

export const flashesAdapter = createEntityAdapter<Flash>({
  selectId: (flash) => flash.id,
  sortComparer: (a, b) =>
    new Date(b.timestamp) < new Date(a.timestamp) ? 1 : -1,
});

export type FlashesAdapter = typeof flashesAdapter;

export type FlashesState = ReturnType<typeof flashesAdapter.getInitialState>;

const flashesSlice = createSlice({
  name: 'flashes',
  initialState: flashesAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [logoutThunk.fulfilled.type]: () => flashesAdapter.getInitialState(),
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => flashesAdapter.addMany(state, action.payload.flashes),
    [createFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<CreateFlashThunkPaylaod>,
    ) => flashesAdapter.addOne(state, action.payload),
    [deleteFlashThunk.fulfilled.type]: (
      state,
      action: PayloadAction<DeleteFlashThunkPayload>,
    ) => flashesAdapter.removeOne(state, action.payload),
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<RefreshUserThunkPaylaod>,
    ) => {
      refreshUser({slice: 'flash', state, action, adapter: flashesAdapter});
    },
    // [createFlashStampThunk.fulfilled.type]: (
    //   state,
    //   action: PayloadAction<CreateFlashStampPayload>,
    // ) => {
    //   // const {userId, ownerId, flashId, value} = action.payload;
    //   // if (userId === ownerId) {
    //   //   const targetFlash = state.entities[flashId];
    //   //   if (targetFlash) {
    //   //     const targetStamp = targetFlash.stamps[value];
    //   //     const newStampData = {
    //   //       ...targetStamp,
    //   //       number: targetStamp.number += 1,
    //   //       userIds: [...targetStamp.userIds, userId],
    //   //     };

    //   //     flashesAdapter.updateOne(state, {
    //   //       id: targetFlash.id,
    //   //       changes: {
    //   //         ...targetFlash,
    //   //         stamps: {
    //   //           ...targetFlash.stamps,
    //   //           ...newStampData,
    //   //         },
    //   //       },
    //   //     });
    //   //   }
    //   // }
    // },
  },
});

const flashesSelector = flashesAdapter.getSelectors();

export const selectAllFlashes = (state: RootState) => {
  return flashesSelector.selectAll(state.flashesReducer);
};

export const flashesReducer = flashesSlice.reducer;
