import {Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';

export const requestLogin = (callback: () => void) => {
  Alert.alert(
    'ログインが無効です',
    'ログインできません。ログインしなおしてください',
    [
      {
        text: 'OK',
        onPress: async () => {
          await Keychain.resetGenericPassword();
          callback();
          return;
        },
      },
    ],
  );
};
