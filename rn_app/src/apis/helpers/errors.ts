import {ThunkDispatch} from '@reduxjs/toolkit';
import {Alert} from 'react-native';

import {RejectPayload, basicAxiosError} from '~/apis/types';
import {alertSomeError} from '~/helpers/errors';
import {logoutThunk} from '~/apis/session/logout';
import {displayShortMessage} from '~/helpers/shortMessages/displayShortMessage';

export const requestLogin = (callback: () => void) => {
  Alert.alert(
    'ログインが無効です',
    'ログインできません。ログインしなおしてください',
    [
      {
        text: 'OK',
        onPress: async () => {
          callback();
          return;
        },
      },
    ],
  );
};

export const handleBasicApiError = ({
  e,
  dispatch,
}: {
  e: any;
  dispatch: ThunkDispatch<unknown, unknown, any>;
}): RejectPayload => {
  if (e && e.response) {
    const axiosError = e as basicAxiosError;
    switch (axiosError.response?.data.errorType) {
      case 'loginError':
        requestLogin(() => dispatch(logoutThunk()));
        return {errorType: 'loginError'};
      case 'invalidError':
        displayShortMessage(axiosError.response.data.message, 'danger');
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

export const handleCredentialsError = (
  dispatch: ThunkDispatch<unknown, unknown, any>,
) => {
  requestLogin(() => dispatch(logoutThunk()));
};
