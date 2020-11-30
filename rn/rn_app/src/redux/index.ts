import {configureStore, createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import {userReducer} from './user';
import {postsReducer} from './post';
import othersReducer from './others';
import {roomsReducer} from './rooms';
import {messagesReducer} from './messages';
import {flashesReducer} from './flashes';

type InitialStateType = {displayedMenu?: boolean};

const initialState: InitialStateType = {displayedMenu: false};

const indexSlice = createSlice({
  name: 'index',
  initialState: initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
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

export const {logout, displayMenu} = indexSlice.actions;

const indexReducer = indexSlice.reducer;

const rootReducer = combineReducers({
  indexReducer,
  userReducer,
  postsReducer,
  othersReducer,
  roomsReducer,
  messagesReducer,
  flashesReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
