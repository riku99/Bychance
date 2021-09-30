import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {defaultTheme} from '~/theme';

type Props = {
  onPress: () => void;
};

export const MoreHoriz = React.memo(({onPress}: Props) => {
  return (
    <Button
      icon={<Icon name="more-horiz" color={defaultTheme.darkGray} />}
      activeOpacity={1}
      buttonStyle={styles.buttonStyles}
      onPress={onPress}
    />
  );
});

const styles = StyleSheet.create({
  buttonStyles: {
    backgroundColor: 'transparent',
  },
});
