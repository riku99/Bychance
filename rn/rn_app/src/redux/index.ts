import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

import userReducer from './user';
import postReducer from './post';

const rootReducer = combineReducers({userReducer, postReducer});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
