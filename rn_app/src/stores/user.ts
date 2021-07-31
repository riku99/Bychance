import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  updateLocationThunk,
  UpdateLocationThunkPaylaod,
} from '../thunks/users/updateLocation';
import {
  EditProfilePayload,
  ChangeShowReceiveMessagePayload,
  ChangeTalkRoomMessageReceiptPayload,
  ChangeUserDisplayPayload,
  ChangeVideoEditDescriptionPayload,
} from '~/hooks/users';

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string;
  statusMessage: string;
  display: boolean;
  lat: number | null;
  lng: number | null;
  backGroundItem: string | null;
  backGroundItemType: 'image' | 'video' | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  videoEditDescription: boolean;
  talkRoomMessageReceipt: boolean;
  showReceiveMessage: boolean;
};

export type UserState = {
  user?: User;
  temporarilySavedData?: {
    name?: string;
    introduce?: string;
    statusMessage?: string;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    tiktok?: string | null;
  };
};

// export type User = NonNullable<UserState['user']>;

const initialState: UserState = {};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        user: action.payload,
      };
    },
    resetUser: () => initialState,
    updateProfile: (state, action: PayloadAction<EditProfilePayload>) => {
      const {
        name,
        introduce,
        avatar,
        statusMessage,
        backGroundItem,
        backGroundItemType,
        instagram,
        twitter,
        youtube,
        tiktok,
      } = action.payload;

      return {
        ...state,
        user: {
          ...state.user!,
          name,
          introduce,
          avatar,
          statusMessage,
          backGroundItemType,
          backGroundItem,
          instagram,
          twitter,
          youtube,
          tiktok,
        },
      };
    },
    setShowReceiveMessage: (
      state,
      action: PayloadAction<ChangeShowReceiveMessagePayload>,
    ) => ({
      ...state,
      user: {
        ...state.user!,
        showReceiveMessage: action.payload,
      },
    }),
    setTalkRoomMessageReceipt: (
      state,
      action: PayloadAction<ChangeTalkRoomMessageReceiptPayload>,
    ) => ({
      ...state,
      user: {
        ...state.user!,
        talkRoomMessageReceipt: action.payload,
      },
    }),
    setDisplay: (state, action: PayloadAction<ChangeUserDisplayPayload>) => ({
      ...state,
      user: {...state.user!, display: action.payload},
    }),
    setVideoDescription: (
      state,
      action: PayloadAction<ChangeVideoEditDescriptionPayload>,
    ) => ({
      ...state,
      user: {
        ...state.user!,
        videoEditDescription: action.payload,
      },
    }),
    setLocation: (
      state,
      actoin: PayloadAction<{lat: number | null; lng: number | null}>,
    ) => ({
      ...state,
      user: {
        ...state.user!,
        lat: actoin.payload.lat,
        lng: actoin.payload.lng,
      },
    }),
    saveEditData: (
      state,
      action: PayloadAction<UserState['temporarilySavedData']>,
    ) => {
      const currentTemporarilySavedData = state.temporarilySavedData;
      if (action.payload?.name) {
        return {
          ...state,
          temporarilySavedData: {
            ...state.temporarilySavedData,
            name: action.payload.name,
          },
        };
      }
      if (action.payload?.introduce || action.payload?.introduce === '') {
        return {
          ...state,
          temporarilySavedData: {
            ...state.temporarilySavedData,
            introduce: action.payload.introduce,
          },
        };
      }
      if (
        action.payload?.statusMessage ||
        action.payload?.statusMessage === ''
      ) {
        return {
          ...state,
          temporarilySavedData: {
            ...state.temporarilySavedData,
            statusMessage: action.payload.statusMessage,
          },
        };
      }
      if (action.payload?.instagram || action.payload?.instagram === '') {
        const {instagram} = action.payload;
        return {
          ...state,
          temporarilySavedData: {
            ...currentTemporarilySavedData,
            instagram,
          },
        };
      }
      if (action.payload?.twitter || action.payload?.twitter === '') {
        const {twitter} = action.payload;
        return {
          ...state,
          temporarilySavedData: {
            ...currentTemporarilySavedData,
            twitter,
          },
        };
      }
      if (action.payload?.youtube || action.payload?.youtube === '') {
        const {youtube} = action.payload;
        return {
          ...state,
          temporarilySavedData: {
            ...currentTemporarilySavedData,
            youtube,
          },
        };
      }
      if (action.payload?.tiktok || action.payload?.tiktok === '') {
        const {tiktok} = action.payload;
        return {
          ...state,
          temporarilySavedData: {
            ...currentTemporarilySavedData,
            tiktok,
          },
        };
      }
    },
    resetEditData: (state) => ({
      ...state,
      temporarilySavedData: undefined,
    }),
  },
  extraReducers: {
    [updateLocationThunk.fulfilled.type]: (
      state,
      action: PayloadAction<UpdateLocationThunkPaylaod>,
    ) => ({
      ...state,
      user: {...state.user!, lat: action.payload.lat, lng: action.payload.lng},
    }),
  },
});

export const {
  saveEditData,
  resetEditData,
  setUser,
  updateProfile,
  resetUser,
  setShowReceiveMessage,
  setTalkRoomMessageReceipt,
  setDisplay,
  setVideoDescription,
  setLocation,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
