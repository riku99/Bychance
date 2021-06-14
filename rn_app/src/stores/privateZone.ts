import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {
  SessionLoginThunkPayload,
  sessionLoginThunk,
} from '~/apis/session/sessionLogin';
import {LineLoginThunkPayload, lineLoginThunk} from '~/apis/session/lineLogin';
import {SampleLoginThunkPayload, sampleLogin} from '~/apis/session/sampleLogin';

export type PrivateZone = {
  id: number;
  address: string;
  // lat: number; クライアント側でlat,lng意識する必要ない。たぶん
  // lng: number;
};

const privateZoneAdapter = createEntityAdapter<PrivateZone>();

const privateZoneSlice = createSlice({
  name: 'privateZone',
  initialState: privateZoneAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      privateZoneAdapter.setAll(state, action.payload.privateZone);
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      privateZoneAdapter.setAll(state, action.payload.privateZone);
    },
    [sampleLogin.fulfilled.type]: (
      state,
      action: PayloadAction<SampleLoginThunkPayload>,
    ) => {
      privateZoneAdapter.setAll(state, action.payload.privateZone);
    },
  },
});

export const privateZoneReducer = privateZoneSlice.reducer;
