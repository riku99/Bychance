import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';

import {UserType} from './user';
import {PostType} from './post';
import {getOthersThunk} from '../actions/others';
import {loginErrorThunk} from '../actions/index';
import {RootState} from './index';

export type OtherUserType = Omit<UserType, 'display' | 'lat' | 'lng'> & {
  posts: PostType[];
};

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
      action: PayloadAction<OtherUserType[]>,
    ) => ({
      ...state,
      others: action.payload,
    }),
  },
});

const selectAllOthers = (state: RootState) => {
  return state.othersReducer;
};

export const selectOthers = createSelector(selectAllOthers, (state) => {
  return state.others!;
});

export default othersSlice.reducer;
