import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';

import {UserType} from './user';
import {Post} from './post';
import {Flash} from './flashes';
import {getOthersThunk} from '../actions/others';
import {RootState} from './index';

export type AnotherUser = Omit<UserType, 'display' | 'lat' | 'lng'> & {
  posts: Post[];
  flashes: Flash[];
};

type initialStateType = {
  others?: AnotherUser[];
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
      action: PayloadAction<AnotherUser[]>,
    ) => {
      return {
        ...state,
        others: action.payload,
      };
    },
  },
});

const selectAllOthers = (state: RootState) => {
  return state.othersReducer;
};

export const selectOthers = createSelector(selectAllOthers, (state) => {
  return state.others!;
});

export default othersSlice.reducer;
