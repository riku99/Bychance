import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {logoutAction} from '../../actions/sessions';
import {Message, receiveMessage} from '../messages';
import {ReceivedMessageData} from '../types';

type InitialState = {
  displayedMenu?: boolean;
  creatingPost?: boolean;
  creatingFlash?: boolean;
  receivedMessage?: Message;
};

const initialState: InitialState = {
  displayedMenu: false,
  creatingPost: false,
  creatingFlash: false,
  receivedMessage: undefined,
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
  },
  extraReducers: {
    [logoutAction.type]: () => initialState,
    [receiveMessage.type]: (
      state,
      action: PayloadAction<ReceivedMessageData>,
    ) => {
      return {
        ...state,
        receivedMessage: action.payload.message,
      };
    },
  },
});

export const {
  displayMenu,
  creatingFlash,
  creatingPost,
  resetRecievedMessage,
} = otherSettingsSlice.actions;

export const otherSettingsReducer = otherSettingsSlice.reducer;
