import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialState = {
  userBackGroundItemVideoPaused: boolean;
  creatingPost: boolean;
  creatingFlash: boolean;
  displayedMenu: boolean;
  pauseFlashProgress: boolean;
  toastLoading: boolean;
  safeArea: {
    top: number;
  };
};

const initialState: InitialState = {
  userBackGroundItemVideoPaused: false,
  creatingPost: false,
  creatingFlash: false,
  displayedMenu: false,
  pauseFlashProgress: false,
  toastLoading: false,
  safeArea: {
    top: 0,
  },
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
