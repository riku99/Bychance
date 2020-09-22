import {Alert} from 'react-native';

export const alertSomeError = () => {
  Alert.alert(
    '何らかののエラーが発生しました',
    'インターネットが繋がっている状態で試してみてください',
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
