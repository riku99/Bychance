import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';

type Props = {buttonSize?: number; iconSize?: number} & Partial<
  Omit<ButtonProps, 'buttonStyle'>
>;

export const CallEndButton = ({
  buttonSize = 52,
  iconSize = 28,
  ...props
}: Props) => {
  return (
    <Button
      icon={{name: 'call-end', color: 'white', size: iconSize}}
      buttonStyle={[
        styles.button,
        {width: buttonSize, height: buttonSize, borderRadius: buttonSize},
      ]}
      activeOpacity={1}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 0,
    backgroundColor: '#f51505',
  },
});
