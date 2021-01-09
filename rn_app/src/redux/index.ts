import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import {sessionReducer} from './session';
import {userReducer} from './user';
import {postsReducer} from './post';
import {roomsReducer} from './rooms';
import {messagesReducer} from './messages';
import {flashesReducer} from './flashes';
import {otherSettingsReducer} from './otherSettings';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  postsReducer,
  roomsReducer,
  messagesReducer,
  flashesReducer,
  otherSettingsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
