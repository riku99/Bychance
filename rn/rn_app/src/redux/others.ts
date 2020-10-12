import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserType} from './user';
import {getOthersThunk} from '../actions/others_action';

export type OtherUserType = Pick<UserType, Exclude<keyof UserType, 'display'>>;

type initialStateType = {
  others?: OtherUserType[];
};

const initialState: initialStateType = {
  others: [],
};

const othersSlice = createSlice({
  name: 'others',
  initialState: initialState,
  reducers: {},
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

export default othersSlice.reducer;
