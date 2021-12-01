import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sessionReducer} from './sessions';
import {userReducer} from './user';
import {flashesReducer} from './flashes';
import {errorsReducer} from './errors';
import {_talkRoomReducer} from './_talkRooms';
import {postsReducer} from './posts';
import {_usersReducer} from './_users';
import {appReducer} from './app';
import {settingsReducer} from './settings';
import {experiencesReducer} from './experiences';
import {videoCallingReducer} from './videoCalling';

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
  experiencesReducer,
  videoCallingReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['sessionReducer', 'userReducer', 'experiencesReducer'],
  debug: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export let store = configureStore({
  reducer: persistedReducer,
  // https://github.com/rt2zz/redux-persist/issues/988
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
