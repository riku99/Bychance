import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialState = {
  userBackGroundItemVideoPaused: boolean;
  creatingPost: boolean;
  creatingFlash: boolean;
  displayedMenu: boolean;
  pauseFlashProgress: boolean;
  toastLoading: boolean;
  groupBadge: boolean;
  safeArea: {
    // useSafeAreaInsetsでtopは取れるが、StatuBarがhiddenになると0になってしまう。StatusBarがhiddenになっても値が欲しい場合あるのでstoreで保存
    top: number;
  };
  loginDataLoading: boolean;
  videoCalling: boolean;
  gettingCall: boolean;
  videoCallingAlertModalVisible: boolean;
};

const initialState: InitialState = {
  userBackGroundItemVideoPaused: false,
  creatingPost: false,
  creatingFlash: false,
  displayedMenu: false,
  pauseFlashProgress: false,
  toastLoading: false,
  groupBadge: false,
  safeArea: {
    top: 0,
  },
  loginDataLoading: false,
  videoCalling: false,
  gettingCall: false,
  videoCallingAlertModalVisible: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<Partial<InitialState>>) => ({
      ...state,
      ...action.payload,
    }),
    resetAppState: () => initialState,
  },
});

export const appReducer = appSlice.reducer;

export const {setAppState, resetAppState} = appSlice.actions;
