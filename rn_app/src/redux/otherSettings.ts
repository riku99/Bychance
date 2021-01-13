import {createSlice} from '@reduxjs/toolkit';

import {logoutAction} from '../actions/sessions';

type InitialState = {
  displayedMenu?: boolean;
  creatingPost: boolean;
  creatingFlash?: boolean;
};

const initialState: InitialState = {
  displayedMenu: false,
  creatingPost: false,
  creatingFlash: false,
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
  },
  extraReducers: {
    [logoutAction.type]: () => initialState,
  },
});

export const {
  displayMenu,
  creatingFlash,
  creatingPost,
} = otherSettingsSlice.actions;

export const otherSettingsReducer = otherSettingsSlice.reducer;
