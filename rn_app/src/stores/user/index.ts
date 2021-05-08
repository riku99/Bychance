import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {refreshUser} from '../helpers/refreshUser';
import {
  lineLoginThunk,
  LineLoginThunkPayload,
} from '../../apis/session/lineLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../apis/session/sessionLogin';
import {editProfileThunk, EdiProfilePayload} from '../../apis/user/editProfile';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '../../apis/user/refreshUser';
import {
  editUserDisplayThunk,
  EidtUserDisplayThunk,
} from '../../apis/user/changeUserDisplay';
import {
  updateLocationThunk,
  UpdateLocationThunkPaylaod,
} from '../../apis/user/updateLocation';
import {sampleLogin} from '../../apis/session/sampleLogin';
import {logoutAction} from '../../apis/session/logout';

export type UserState = {
  user?: {
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
  };
  temporarilySavedData?: {
    name?: string;
    introduce?: string;
    statusMessage?: string;
  };
};

export type User = NonNullable<UserState['user']>;

const initialState: UserState = {};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    saveEditData: (
      state,
      action: PayloadAction<UserState['temporarilySavedData']>,
    ) => {
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
    },
    resetEditData: (state) => ({
      ...state,
      temporarilySavedData: undefined,
    }),
  },
  extraReducers: {
    [sampleLogin.fulfilled.type]: (state, action) => {
      return {
        ...state,
        user: action.payload.user,
      };
    },
    [lineLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<LineLoginThunkPayload>,
    ) => {
      return {
        ...state,
        user: action.payload.user,
      };
    },
    [sessionLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SessionLoginThunkPayload>,
    ) => {
      return {
        ...state,
        user: action.payload.user,
      };
    },
    [logoutAction.type]: () => initialState,
    [editProfileThunk.fulfilled.type]: (
      state,
      actions: PayloadAction<EdiProfilePayload>,
    ) => ({
      ...state,
      user: {
        ...state.user!,
        name: actions.payload.name,
        introduce: actions.payload.introduce,
        avatar: actions.payload.avatar,
        statusMessage: actions.payload.statusMessage,
      },
    }),
    [editUserDisplayThunk.fulfilled.type]: (
      state,
      action: PayloadAction<EidtUserDisplayThunk>,
    ) => ({
      ...state,
      user: {...state.user!, display: action.payload},
    }),
    [updateLocationThunk.fulfilled.type]: (
      state,
      action: PayloadAction<UpdateLocationThunkPaylaod>,
    ) => ({
      ...state,
      user: {...state.user!, lat: action.payload.lat, lng: action.payload.lng},
    }),
    [refreshUserThunk.fulfilled.type]: (
      state,
      action: PayloadAction<RefreshUserThunkPaylaod>,
    ): UserState => {
      return refreshUser({
        slice: userSlice.name,
        state,
        action,
      }) as UserState;
    },
  },
});

export const {saveEditData, resetEditData} = userSlice.actions;

export const userReducer = userSlice.reducer;
