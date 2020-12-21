import {configureStore, createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import {userReducer} from './user';
import {postsReducer} from './post';
import {roomsReducer} from './rooms';
import {messagesReducer} from './messages';
import {flashesReducer} from './flashes';

type InitialStateType = {displayedMenu?: boolean; creatingFlash?: boolean};

const initialState: InitialStateType = {
  displayedMenu: false,
  creatingFlash: false,
};

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
    creatingFlash: (state) => {
      return {
        ...state,
        creatingFlash: state.creatingFlash ? false : true,
      };
    },
  },
});

export const {logout, displayMenu, creatingFlash} = indexSlice.actions;

const indexReducer = indexSlice.reducer;

const rootReducer = combineReducers({
  indexReducer,
  userReducer,
  postsReducer,
  roomsReducer,
  messagesReducer,
  flashesReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
