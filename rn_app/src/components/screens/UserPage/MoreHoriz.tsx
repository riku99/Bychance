import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {normalStyles} from '~/constants/styles';

type Props = {
  onPress: () => void;
};

export const MoreHoriz = React.memo(({onPress}: Props) => {
  return (
    <Button
      icon={<Icon name="more-horiz" color={normalStyles.headerTitleColor} />}
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
