import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {loginErrorThunk} from '../actions/index';
import {
  firstLoginThunk,
  subsequentLoginAction,
  editProfileAction,
} from '../actions/users';

type initialStateType = {
  login: boolean;
  errors?: {invalidError?: string};
  redirect?: boolean;
  user?: {
    id: number;
    name: string;
    image: null | string;
    introduce: string;
    message: string;
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
        console.log(actions.payload.invalid);
        return {
          ...state,
          errors: {invalidError: actions.payload.invalid},
          redirect: true,
        };
      }
    },
  },
});

export const {falseRedirect, deleteInvalidAction} = userSlice.actions;

export default userSlice.reducer;
