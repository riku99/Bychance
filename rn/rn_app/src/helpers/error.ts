import {Alert} from 'react-native';

export const alertSomeError = () => {
  Alert.alert(
    'エラーが発生しました',
    'インターネットが繋がっているか確認してください',
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
