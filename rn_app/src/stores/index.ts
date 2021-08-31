import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {sessionReducer} from './sessions';
import {userReducer} from './user';
import {flashesReducer} from './flashes';
import {errorsReducer} from './errors';
import {_talkRoomReducer} from './_talkRooms';
import {postsReducer} from './posts';
import {_usersReducer} from './_users';
import {appReducer} from './app';
import {settingsReducer} from './settings';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  postsReducer,
  flashesReducer,
  errorsReducer,
  _talkRoomReducer,
  _usersReducer,
  appReducer,
  settingsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
