import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {logoutThunk} from '~/thunks/session/logout';
import {TalkRoomMessage, receiveTalkRoomMessage} from './talkRoomMessages';
import {ReceivedMessageData} from './types';

type InitialState = {
  displayedMenu?: boolean;
  creatingPost?: boolean;
  creatingFlash?: boolean;
  receivedMessage?: TalkRoomMessage;
  manualLocationUpdate?: boolean;
  canvas: {
    open: boolean;
    enabled: boolean;
  };
};

const initialState: InitialState = {
  displayedMenu: false,
  creatingPost: false,
  creatingFlash: false,
  receivedMessage: undefined,
  manualLocationUpdate: false,
  canvas: {
    open: false,
    enabled: false,
  },
};

const otherSettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    displayMenu: (state) => {
      if (state.displayedMenu === false) {
        return {
          ...state,
          displayedMenu: true,
        };
      } else {
        return {
          ...state,
          displayedMenu: false,
        };
      }
    },
    creatingPost: (state) => {
      return {
        ...state,
        creatingPost: !state.creatingPost,
      };
    },
    creatingFlash: (state) => {
      return {
        ...state,
        creatingFlash: state.creatingFlash ? false : true,
      };
    },
    resetRecievedMessage: (state) => ({
      ...state,
      receivedMessage: undefined,
    }),
    manualLocationUpdate: (state, aciton: PayloadAction<boolean>) => ({
      ...state,
      manualLocationUpdate: aciton.payload,
    }),
    setCanvasMode: (
      state,
      action: PayloadAction<{
        open: boolean;
        enabled: boolean;
      }>,
    ) => ({
      ...state,
      canvas: action.payload,
    }),
  },
  extraReducers: {
    [logoutThunk.fulfilled.type]: () => initialState,
    [receiveTalkRoomMessage.type]: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      if (
        !state.receivedMessage ||
        state.receivedMessage.id !== action.payload.message.id
      ) {
        return {
          ...state,
          receivedMessage: action.payload.message,
        };
      }
    },
  },
});

export const {
  displayMenu,
  creatingFlash,
  creatingPost,
  resetRecievedMessage,
  manualLocationUpdate,
  setCanvasMode,
} = otherSettingsSlice.actions;

export const otherSettingsReducer = otherSettingsSlice.reducer;
