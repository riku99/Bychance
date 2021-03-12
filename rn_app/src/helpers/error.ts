import {Alert} from 'react-native';
import {ThunkDispatch} from '@reduxjs/toolkit';

import {rejectPayload, basicAxiosError} from '../actions/types';
import {requestLogin} from '../helpers/login';
import {logoutAction} from '../actions/session/logout';

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
