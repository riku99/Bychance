import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {} & Partial<ButtonProps>;

export const ModalCloseButton = ({...props}: Props) => {
  return (
    <Button
      icon={{
        name: 'close',
        color: 'white',
        size: 22,
        iconStyle: {fontWeight: 'bold'},
      }}
      buttonStyle={styles.button}
      activeOpacity={1}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 40,
    padding: 0,
    backgroundColor: defaultTheme.darkGray,
  },
});
