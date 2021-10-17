import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserBackGroundItem} from '~/types';

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  statusMessage: string | null;
  lat: number | null;
  lng: number | null;
  backGroundItem: UserBackGroundItem | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  isDisplayedToOtherUsers: boolean; // 現在他のユーザーに表示されているかどうか
};

const initialState: User = {
  id: '',
  name: '',
  avatar: null,
  introduce: '',
  statusMessage: '',
  lat: null,
  lng: null,
  backGroundItem: null,
  instagram: null,
  twitter: null,
  youtube: null,
  tiktok: null,
  isDisplayedToOtherUsers: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetUser: () => initialState,
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setLocation: (
      state,
      actoin: PayloadAction<{lat: number | null; lng: number | null}>,
    ) => ({
      ...state,
      lat: actoin.payload.lat,
      lng: actoin.payload.lng,
    }),
  },
});

export const {setUser, resetUser, setLocation, updateUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
