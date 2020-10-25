import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserType} from './user';
import {PostType} from './post';
import {getOthersThunk} from '../actions/others';
import {loginErrorThunk} from '../actions/index';

export type OtherUserType = Pick<
  UserType,
  Exclude<keyof UserType, 'display' | 'lat' | 'lng'>
> & {posts: PostType[]};

type initialStateType = {
  others?: OtherUserType[];
  otherUser?: OtherUserType;
};

const initialState: initialStateType = {
  others: [],
};

const othersSlice = createSlice({
  name: 'others',
  initialState,
  reducers: {},
  extraReducers: {
    [loginErrorThunk.fulfilled.type]: () => initialState,
    [getOthersThunk.fulfilled.type]: (
      state,
      actions: PayloadAction<OtherUserType[]>,
    ) => ({
      ...state,
      others: actions.payload,
    }),
  },
});

export default othersSlice.reducer;
