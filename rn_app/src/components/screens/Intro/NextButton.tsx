import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  onPress: () => void;
  title: string;
  containerStyle: ButtonProps['containerStyle'];
};

export const NextButton = ({onPress, title, containerStyle}: Props) => {
  return (
    <Button
      buttonStyle={styles.button}
      titleStyle={styles.title}
      containerStyle={containerStyle}
      onPress={onPress}
      title={title}
      activeOpacity={1}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: defaultTheme.primary,
  },
  title: {
    fontWeight: 'bold',
  },
});
