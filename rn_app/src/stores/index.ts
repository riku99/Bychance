import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {sessionReducer} from './session';
import {userReducer} from './user';
import {postsReducer} from './posts';
import {roomsReducer} from './talkRooms';
import {chatPartnersReducer} from './chatPartners';
import {messagesReducer} from './messages';
import {flashesReducer} from './flashes';
import {nearbyUsersReducer} from './nearbyUsers';
import {otherSettingsReducer} from './otherSettings';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  postsReducer,
  roomsReducer,
  chatPartnersReducer,
  messagesReducer,
  flashesReducer,
  nearbyUsersReducer,
  otherSettingsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
