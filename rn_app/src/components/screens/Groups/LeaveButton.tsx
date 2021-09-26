import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  containerStyle?: ButtonProps['containerStyle'];
  onPress: () => void;
};

export const LeaveButton = React.memo(({containerStyle, onPress}: Props) => {
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
