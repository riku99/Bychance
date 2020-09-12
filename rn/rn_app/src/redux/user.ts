import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {firstLoginAction, subsequentLoginAction} from '../actions/users_action';

type initialStateType = {
  loding?: boolean;
  login: boolean;
  login_error?: string;
  user?: {
    name: string;
    image: null | string;
    introduce: null | string;
    message: null | string;
    display: boolean;
  };
};

type userType = initialStateType['user'];

const initialState: initialStateType = {
  login: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<userType>) => ({
      ...state,
      login: true,
      user: {
        name: action.payload!.name,
        image: action.payload!.image,
        introduce: action.payload!.introduce,
        message: action.payload!.message,
        display: action.payload!.display,
      },
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
          name: action.payload!.name,
          image: action.payload!.image,
          introduce: action.payload!.introduce,
          message: action.payload!.message,
          display: action.payload!.display,
        },
      };
    },
    [firstLoginAction.rejected.type]: (state, action) => {
      return {
        ...state,
        login: false,
        login_error: action.payload,
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
          name: action.payload!.name,
          image: action.payload!.image,
          introduce: action.payload!.introduce,
          message: action.payload!.message,
          display: action.payload!.display,
        },
      };
    },
    [subsequentLoginAction.rejected.type]: (
      state,
      action: PayloadAction<string>,
    ) => {
      return {
        ...state,
        login: false,
        user: undefined,
        login_error: action.payload,
      };
    },
  },
});

export const {loginUser} = userSlice.actions;

export default userSlice.reducer;
