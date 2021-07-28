import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ApiError} from '~/types/errors';

type ErrorState = {
  apiError?: ApiError;
};

const initialState: ErrorState = {apiError: undefined};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ApiError>) => ({
      apiError: action.payload,
    }),
    resetError: () => ({
      apiError: undefined,
    }),
  },
});

export const errorsReducer = errorsSlice.reducer;

export const {resetError, setError} = errorsSlice.actions;
