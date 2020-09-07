import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';

type initialStateType = {
  login: boolean;
  user?: {name: String};
};

const initialState: initialStateType = {
  login: false,
};

export const postJWT = createAsyncThunk<Object, {name: string}>(
  'users/postJWT',
  async (token) => {
    console.log(token);
    return token.name;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{name: String}>) => ({
      ...state,
      login: true,
      user: {name: action.payload.name},
    }),
  },
  extraReducers: {
    [postJWT.fulfilled.type]: (state, action) => {
      return {
        ...state,
        login: true,
        user: {name: action.payload.name},
      };
    },
  },
});

export const {loginUser} = userSlice.actions;

export default userSlice.reducer;
