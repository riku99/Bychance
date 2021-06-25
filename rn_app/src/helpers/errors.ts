import {ThunkDispatch} from '@reduxjs/toolkit';
import {Alert} from 'react-native';

import {RejectPayload} from '~/thunks/types';
import {logoutThunk} from '~/thunks/session/logout';
import {BasicAxiosError} from '~/types';
import {showBottomToast} from '~/stores/bottomToast';

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

export const requestLogin = (callback?: () => void) => {
  Alert.alert(
    'ログインが無効です',
    'ログインできません。ログインしなおしてください',
    [
      {
        text: 'OK',
        onPress: async () => {
          if (callback) {
            callback();
          }
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
        dispatch(
          showBottomToast({
            data: {
              message: axiosError.response.data.message,
              timestamp: new Date().toString(),
              type: 'danger',
            },
          }),
        );
        return {
          errorType: 'invalidError',
        };
      default:
        dispatch(
          showBottomToast({
            data: {
              message: '何らかのエラーが発生しました',
              timestamp: new Date().toString(),
              type: 'danger',
            },
          }),
        );
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

export const handleCredentialsError = (
  dispatch: ThunkDispatch<unknown, unknown, any>,
) => {
  requestLogin(() => dispatch(logoutThunk()));
};
