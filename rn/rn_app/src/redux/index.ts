import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import userReducer from './user';
import postReducer from './post';
import othersReducer from './others';

const rootReducer = combineReducers({userReducer, postReducer, othersReducer});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
