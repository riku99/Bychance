import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {displayMenu} from '../../redux/otherSettings';

export const MenuBar = () => {
  const dispatch = useDispatch();
  return (
    <Button
      icon={{name: 'menu', color: '#64a0d9'}}
      buttonStyle={styles.button}
      onPress={() => {
        dispatch(displayMenu());
      }}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
});
