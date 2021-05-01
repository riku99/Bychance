import {Alert} from 'react-native';

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

export const alertInvalidError = (message: string) => {
  Alert.alert(message, '', [
    {
      text: 'OK',
      onPress: () => {
        return;
      },
    },
  ]);
};
