import {ThunkDispatch, AnyAction} from '@reduxjs/toolkit';
import {logout} from '../redux/index';
import {rejectPayload, basicAxiosError} from '../actions/d';
import {requestLogin} from '../helpers/login';

export const handleBasicAxiosError = ({
  e,
  dispatch,
}: {
  e: any;
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
}): rejectPayload => {
  if (e && e.response) {
    const axiosError = e as basicAxiosError;
    switch (axiosError.response?.data.errorType) {
      case 'loginError':
        requestLogin(() => dispatch(logout()));
        return {errorType: 'loginError'};
      case 'invalidError':
        return {
          errorType: 'invalidError',
          message: axiosError.response.data.message,
        };
      default:
        return {
          errorType: 'someError',
        };
    }
  } else {
    return {
      errorType: 'someError',
    };
  }
};
