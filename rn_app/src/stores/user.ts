import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  statusMessage: string | null;
  lat: number | null;
  lng: number | null;
  backGroundItem: string | null;
  backGroundItemType: 'image' | 'video' | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
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
  backGroundItemType: null,
  instagram: null,
  twitter: null,
  youtube: null,
  tiktok: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
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
    // updateProfile: (state, action: PayloadAction<User>) => {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },
  },
});

export const {setUser, resetUser, setLocation, updateUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
