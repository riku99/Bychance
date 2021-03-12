import {ThunkDispatch} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from '~/actions/types';
import {requestLogin} from '~/actions/helpers/errors/requestLogin';
import {alertSomeError} from '~/helpers/errors/alertSomeError';
import {logoutAction} from '~/actions/session/logout';

export const handleBasicError = ({
  e,
  dispatch,
}: {
  e: any;
  dispatch: ThunkDispatch<unknown, unknown, any>;
}): rejectPayload => {
  if (e && e.response) {
    const axiosError = e as basicAxiosError;
    switch (axiosError.response?.data.errorType) {
      case 'loginError':
        requestLogin(() => dispatch(logoutAction));
        return {errorType: 'loginError'};
      case 'invalidError':
        return {
          errorType: 'invalidError',
          message: axiosError.response.data.message,
        };
      default:
        console.log(e.response);
        alertSomeError();
        return {
          errorType: 'someError',
        };
    }
  } else {
    console.log(e.response);
    alertSomeError();
    return {
      errorType: 'someError',
    };
  }
};
