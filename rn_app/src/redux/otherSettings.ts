import {createSlice} from '@reduxjs/toolkit';

import {logoutAction} from '../actions/sessions';

type InitialState = {displayedMenu?: boolean; creatingFlash?: boolean};

const initialState: InitialState = {
  displayedMenu: false,
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

export const {displayMenu, creatingFlash} = otherSettingsSlice.actions;

export const otherSettingsReducer = otherSettingsSlice.reducer;
