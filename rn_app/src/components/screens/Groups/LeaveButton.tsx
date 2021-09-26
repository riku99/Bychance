import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  containerStyle?: ButtonProps['containerStyle'];
  onPress: () => void;
  title: string;
};

export const LeaveButton = React.memo(
  ({containerStyle, onPress, title}: Props) => {
    return (
      <Button
        title={title}
        containerStyle={containerStyle}
        titleStyle={styles.buttonTitle}
        buttonStyle={styles.button}
        activeOpacity={1}
        onPress={onPress}
      />
    );
  },
);

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
