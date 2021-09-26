import React from 'react';
import {StyleSheet, Alert} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {defaultTheme} from '~/theme';

import {useDeleteUsersGroupId} from '~/hooks/users';

type Props = {
  containerStyle?: ButtonProps['containerStyle'];
};

export const LeaveButton = React.memo(({containerStyle}: Props) => {
  const {deleteGroupId} = useDeleteUsersGroupId();
  const onPress = () => {
    Alert.alert('グループから抜けますか?', '', [
      {
        text: '抜ける',
        style: 'destructive',
        onPress: () => {
          deleteGroupId();
        },
      },
      {
        text: 'キャンセル',
      },
    ]);
  };

  return (
    <Button
      title="グループから抜ける"
      containerStyle={containerStyle}
      titleStyle={styles.buttonTitle}
      buttonStyle={styles.button}
      activeOpacity={1}
      onPress={onPress}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: defaultTheme.darkGray,
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
