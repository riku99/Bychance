import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type VideoCallingState = {
  channelName: string | null;
  token: string | null;
  uid: number | null; // ビデオ通話用uidはnumberでなければいけないのでUserのIDとは別にする
};

type InitialState = VideoCallingState;

const initialState: InitialState = {
  channelName: null,
  token: null,
  uid: null,
};

const videoCallingSlice = createSlice({
  name: 'videoCalling',
  initialState,
  reducers: {
    setVideoCallingState: (state, action: PayloadAction<InitialState>) =>
      action.payload,
  },
});

export const videoCallingReducer = videoCallingSlice.reducer;

export const {setVideoCallingState} = videoCallingSlice.actions;
