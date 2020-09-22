import {Alert} from 'react-native';

export const requestLogin = (callback: () => void) => {
  Alert.alert(
    'ログインが無効です',
    'ログインできません。ログインしなおしてください',
    [
      {
        text: 'OK',
        onPress: () => {
          callback();
          return;
        },
      },
    ],
  );
};
