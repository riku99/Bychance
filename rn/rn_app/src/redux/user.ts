import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {loginErrorThunk} from '../actions/index';
import {
  firstLoginThunk,
  subsequentLoginAction,
  editProfileAction,
  editUserDisplayThunk,
  updatePositionThunk,
  sampleLogin,
} from '../actions/users';
import {SuccessfullLoginData} from '../apis/usersApi';

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
  errors?: {};
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
    [sampleLogin.fulfilled.type]: (state, action) => {
      return {
        ...state,
        login: true,
        user: action.payload.user,
      };
    },
    [loginErrorThunk.fulfilled.type]: () => initialState,
    [firstLoginThunk.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      return {
        ...state,
        login: true,
        user: action.payload.user,
      };
    },
    [subsequentLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<SuccessfullLoginData>,
    ) => {
      return {
        ...state,
        login: true,
        user: action.payload.user,
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

export const userReducer = userSlice.reducer;
