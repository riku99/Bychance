import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialState = {
  userBackGroundItemVideoPaused: boolean;
  creatingPost: boolean;
  creatingFlash: boolean;
  displayedMenu: boolean;
};

const initialState: InitialState = {
  userBackGroundItemVideoPaused: false,
  creatingPost: false,
  creatingFlash: false,
  displayedMenu: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<Partial<InitialState>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const appReducer = appSlice.reducer;

export const {setAppState} = appSlice.actions;
