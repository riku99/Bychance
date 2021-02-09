import {Alert} from 'react-native';
import {ThunkDispatch, AnyAction} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from '../actions/types';
import {requestLogin} from '../helpers/login';
import {logoutAction} from '../actions/sessions';

export const alertSomeError = () => {
  Alert.alert(
    'エラーが発生しました',
    'インターネットに繋がっているか確認してください',
    [
      {
        text: 'OK',
        onPress: () => {
          return;
        },
      },
    ],
  );
};

export const handleBasicError = ({
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
