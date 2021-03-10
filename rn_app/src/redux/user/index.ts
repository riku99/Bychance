import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {refreshUser} from '../helpers/refreshUser';
import {
  firstLoginThunk,
  FirstLoginThunkPayload,
} from '../../actions/session/firstLogin';
import {
  sessionLoginThunk,
  SessionLoginThunkPayload,
} from '../../actions/session/sessionLogin';
import {
  editProfileThunk,
  EdiProfilePayload,
} from '../../actions/user/editProfile';
import {
  refreshUserThunk,
  RefreshUserThunkPaylaod,
} from '../../actions/user/refreshUser';
import {
  editUserDisplayThunk,
  EidtUserDisplayThunk,
} from '../../actions/user/editUserDisplay';
import {
  updateLocationThunk,
  UpdateLocationThunkPaylaod,
} from '../../actions/user/updateLocation';
import {sampleLogin} from '../../actions/session/sampleLogin';
import {logoutAction} from '../../actions/session/logout';

export type UserState = {
  user?: {
    id: number;
    name: string;
    image: string | null;
    introduce: string;
    message: string;
    display: boolean;
    lat: number | null;
    lng: number | null;
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
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<FirstLoginThunkPayload>,
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
        image: actions.payload.image,
        message: actions.payload.message,
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
