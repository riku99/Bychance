import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {loginErrorThunk} from '../actions/index';
import {
  firstLoginThunk,
  subsequentLoginAction,
  editProfileAction,
  editUserDisplayThunk,
  updatePositionThunk,
} from '../actions/users';

type initialStateType = {
  login: boolean;
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
  errors?: {invalidError?: string};
};

export type UserType = NonNullable<initialStateType['user']>;

const initialState: initialStateType = {
  login: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    deleteInvalidAction: (state) => ({
      ...state,
      errors: {invalidError: undefined},
    }),
  },
  extraReducers: {
    [loginErrorThunk.fulfilled.type]: () => initialState,
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<UserType>,
    ) => {
      return {
        ...state,
        login: true,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          image: action.payload.image,
          introduce: action.payload.introduce,
          message: action.payload.message,
          display: action.payload.display,
          lat: action.payload.lat,
          lng: action.payload.lng,
        },
      };
    },
    [subsequentLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<UserType>,
    ) => {
      return {
        ...state,
        login: true,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          image: action.payload.image,
          introduce: action.payload.introduce,
          message: action.payload.message,
          display: action.payload.display,
          lat: action.payload.lat,
          lng: action.payload.lng,
        },
      };
    },
    [editProfileAction.fulfilled.type]: (
      state,
      actions: PayloadAction<UserType>,
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
    [editProfileAction.rejected.type]: (
      state,
      actions: PayloadAction<{
        invalid?: string;
      }>,
    ) => {
      if (actions.payload.invalid) {
        return {
          ...state,
          errors: {invalidError: actions.payload.invalid},
          redirect: true,
        };
      }
    },
    [editUserDisplayThunk.fulfilled.type]: (
      state,
      action: PayloadAction<boolean>,
    ) => ({
      ...state,
      user: {...state.user!, display: action.payload},
    }),
    [updatePositionThunk.fulfilled.type]: (
      state,
      action: PayloadAction<{lat: number; lng: number}>,
    ) => ({
      ...state,
      user: {...state.user!, lat: action.payload.lat, lng: action.payload.lng},
    }),
  },
});

export const {deleteInvalidAction} = userSlice.actions;

export default userSlice.reducer;
