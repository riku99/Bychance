import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';

import {UserType} from './user';
import {Post} from './post';
import {getOthersThunk} from '../actions/others';
import {RootState} from './index';

export type anotherUser = Omit<UserType, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
};

type initialStateType = {
  others?: anotherUser[];
};

const initialState: initialStateType = {
  others: [],
};

const othersSlice = createSlice({
  name: 'others',
  initialState,
  reducers: {},
  extraReducers: {
    'index/logout': () => initialState,
    [getOthersThunk.fulfilled.type]: (
      state,
      action: PayloadAction<anotherUser[]>,
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
