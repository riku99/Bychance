import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {sessionReducer} from './sessions';
import {userReducer} from './user';
import {flashesReducer} from './flashes';
import {nearbyUsersReducer} from './nearbyUsers';
import {otherSettingsReducer} from './otherSettings';
import {flashStampsReducer} from './flashStamps';
import {errorsReducer} from './errors';
import {_talkRoomReducer} from './_talkRooms';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  flashesReducer,
  nearbyUsersReducer,
  otherSettingsReducer,
  flashStampsReducer,
  errorsReducer,
  _talkRoomReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
