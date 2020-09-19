import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  firstLoginAction,
  subsequentLoginAction,
  editProfileAction,
} from '../actions/users_action';

type initialStateType = {
  login: boolean;
  errors?: {login_error?: string; invalid_error?: string};
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

export type userType = NonNullable<initialStateType['user']>;

const initialState: initialStateType = {
  login: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginError: (state, actions: PayloadAction<string>) => ({
      ...state,
      login: false,
      loading: false,
      errors: {login_error: actions.payload},
      user: undefined,
    }),
    falseRedirect: (state) => ({
      ...state,
      redirect: false,
    }),
  },
  extraReducers: {
    [firstLoginAction.fulfilled.type]: (
      state,
      action: PayloadAction<userType>,
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
      action: PayloadAction<userType>,
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
      actions: PayloadAction<userType>,
    ) => ({
      ...state,
      redirect: true,
      user: {
        ...state.user!,
        name: actions.payload.name,
        introduce: actions.payload.introduce,
      },
    }),
    [editProfileAction.rejected.type]: (
      state,
      actions: PayloadAction<string>,
    ) => ({
      ...state,
      errors: {invalid_error: actions.payload},
    }),
  },
});

export const {loginError, falseRedirect} = userSlice.actions;

export default userSlice.reducer;
