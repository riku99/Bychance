import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {sessionReducer} from './sessions';
import {userReducer} from './user';
import {postsReducer} from './posts';
import {talkRoomsReducer} from './talkRooms';
import {chatPartnersReducer} from './chatPartners';
import {talkRoomMessageReducer} from './talkRoomMessages';
import {flashesReducer} from './flashes';
import {nearbyUsersReducer} from './nearbyUsers';
import {otherSettingsReducer} from './otherSettings';
import {flashStampsReducer} from './flashStamps';
import {errorsReducer} from './errors';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  postsReducer,
  talkRoomsReducer,
  chatPartnersReducer,
  talkRoomMessageReducer,
  flashesReducer,
  nearbyUsersReducer,
  otherSettingsReducer,
  flashStampsReducer,
  errorsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
