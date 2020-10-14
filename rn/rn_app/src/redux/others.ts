import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserType} from './user';
import {PostType} from './post';
import {getOthersThunk} from '../actions/others_action';

export type OtherUserType = Pick<
  UserType,
  Exclude<keyof UserType, 'display'>
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
  reducers: {
    // ログアウト時のアクションをあとでつくる。postにも作る
    setOtherUser: (state, actions: PayloadAction<OtherUserType>) => ({
      ...state,
      otherUser: actions.payload,
    }),
  },
  extraReducers: {
    [getOthersThunk.fulfilled.type]: (
      state,
      actions: PayloadAction<OtherUserType[]>,
    ) => ({
      ...state,
      others: actions.payload,
    }),
  },
});

export const {setOtherUser} = othersSlice.actions;

export default othersSlice.reducer;
