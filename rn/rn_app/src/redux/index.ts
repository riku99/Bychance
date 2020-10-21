import {configureStore, createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import userReducer from './user';
import postReducer from './post';
import othersReducer from './others';

type InitialStateType = {displayedMenu?: boolean};

const initialState: InitialStateType = {displayedMenu: false};

const indexSlice = createSlice({
  name: 'index',
  initialState: initialState,
  reducers: {
    displayMenu: (state) => {
      if (state.displayedMenu === false) {
        return {
          ...state,
          displayedMenu: true,
        };
      } else {
        return {
          ...state,
          displayedMenu: false,
        };
      }
    },
  },
});

export const {displayMenu} = indexSlice.actions;

const indexReducer = indexSlice.reducer;

const rootReducer = combineReducers({
  indexReducer,
  userReducer,
  postReducer,
  othersReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
