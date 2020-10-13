import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  firstLoginAction,
  subsequentLoginAction,
  editProfileAction,
} from '../actions/users_action';

type initialStateType = {
  login: boolean;
  errors?: {invalidError?: string};
  redirect?: boolean;
  user?: {
    id: number;
    name: string;
    image: null | string;
    introduce: null | string;
    message: null | string;
    display: boolean;
  };
};

export type UserType = NonNullable<initialStateType['user']>;

const initialState: initialStateType = {
  login: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginError: (state) => ({
      ...state,
      login: false,
      user: undefined,
    }),
    falseRedirect: (state) => ({
      ...state,
      redirect: false,
    }),
    deleteInvalidAction: (state) => ({
      ...state,
      errors: {invalidError: undefined},
    }),
  },
  extraReducers: {
    [firstLoginAction.fulfilled.type]: (
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
        },
      };
    },
    [editProfileAction.fulfilled.type]: (
      state,
      actions: PayloadAction<UserType>,
    ) => ({
      ...state,
      redirect: true,
      user: {
        ...state.user!,
        name: actions.payload.name,
        introduce: actions.payload.introduce,
        image: actions.payload.image,
      },
    }),
    [editProfileAction.rejected.type]: (
      state,
      actions: PayloadAction<string>,
    ) => ({
      ...state,
      errors: {invalidError: actions.payload},
    }),
  },
});

export const {
  loginError,
  falseRedirect,
  deleteInvalidAction,
} = userSlice.actions;

export default userSlice.reducer;
