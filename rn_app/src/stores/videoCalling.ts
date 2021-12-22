import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type VideoCallingState = {
  channelName: string;
  token: string;
  uid: number; // ビデオ通話用uidはnumberでなければいけないのでUserのIDとは別にする
  role: 'pub' | 'sub'; // pubはかけた側、subは受け取る側
  callHistoryId?: number;
  publisher: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

type InitialState = VideoCallingState | null;

const initialState: InitialState = null;
const videoCallingSlice = createSlice({
  name: 'videoCalling',
  initialState: initialState as InitialState,
  reducers: {
    setVideoCallingState: (state, action: PayloadAction<InitialState>) => {
      return action.payload;
    },
  },
});

export const videoCallingReducer = videoCallingSlice.reducer;

export const {setVideoCallingState} = videoCallingSlice.actions;
