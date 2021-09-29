import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Settings = {
  display?: boolean;
  talkRoomMessageReceipt?: boolean;
  showReceiveMessage?: boolean;
  groupsApplicationEnabled?: boolean;
};

const initialState: Settings = {};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSetitngs: (state, action: PayloadAction<Settings>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const settingsReducer = settingsSlice.reducer;

export const {setSetitngs} = settingsSlice.actions;
