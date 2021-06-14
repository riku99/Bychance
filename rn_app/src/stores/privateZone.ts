import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {RootState} from './index';

type PrivateZone = {
  id: number;
  address: string;
  // lat: number; クライアント側でlat,lng意識する必要ない。たぶん
  // lng: number;
};

const privateZoneAdapter = createEntityAdapter<PrivateZone[]>();

const privateZoneSlice = createSlice({
  name: 'privateZone',
  initialState: privateZoneAdapter.getInitialState(),
  reducers: {},
  extraReducers: {},
});

export const privateZoneReducer = privateZoneSlice.reducer;
