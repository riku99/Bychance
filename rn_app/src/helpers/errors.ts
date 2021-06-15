import {ThunkDispatch} from '@reduxjs/toolkit';
import {Alert} from 'react-native';

import {RejectPayload} from '~/apis/types';
import {logoutThunk} from '~/apis/session/logout';
// import {displayShortMessage} from '~/helpers/topShortMessage';
import {BasicAxiosError} from '~/types';

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

export const handleBasicApiErrorWithDispatch = ({
  e,
  dispatch,
}: {
  e: any;
  dispatch: ThunkDispatch<unknown, unknown, any>;
}): RejectPayload => {
  if (e && e.response) {
    const axiosError = e as BasicAxiosError;
    switch (axiosError.response?.data.errorType) {
      case 'loginError':
        requestLogin(() => dispatch(logoutThunk()));
        return {errorType: 'loginError'};
      case 'invalidError':
        return {
          errorType: 'invalidError',
          message: axiosError.response.data.message,
          toastType: 'danger',
        };
      default:
        return {
          errorType: 'someError',
          toastType: 'normal',
          message: '何らかのエラーが発生しました',
        };
    }
  } else {
    return {
      errorType: 'someError',
      toastType: 'normal',
      message: '何らかのエラーが発生しました',
    };
  }
};

export const handleCredentialsError = (
  dispatch: ThunkDispatch<unknown, unknown, any>,
) => {
  requestLogin(() => dispatch(logoutThunk()));
};
