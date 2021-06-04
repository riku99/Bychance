import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {displayMenu} from '../../../stores/otherSettings';
import {normalStyles} from '~/constants/styles';

export const MenuBar = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <Button
      icon={{name: 'menu', size: 25, color: normalStyles.headerTitleColor}}
      buttonStyle={styles.button}
      onPress={() => {
        dispatch(displayMenu());
      }}
      activeOpacity={1}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
});
