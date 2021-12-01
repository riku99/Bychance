import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type VideoCallingState = {
  channelName: string | null;
  token: string | null;
  uid: number | null; // ビデオ通話用uidはnumberでなければいけないのでUserのIDとは別にする
  publisher: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

type InitialState = VideoCallingState;

const initialState: InitialState = {
  channelName: null,
  token: null,
  uid: null,
  publisher: null,
};

const videoCallingSlice = createSlice({
  name: 'videoCalling',
  initialState,
  reducers: {
    setVideoCallingState: (
      state,
      action: PayloadAction<Partial<InitialState>>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const videoCallingReducer = videoCallingSlice.reducer;

export const {setVideoCallingState} = videoCallingSlice.actions;
