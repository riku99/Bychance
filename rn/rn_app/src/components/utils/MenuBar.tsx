import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

export const MenuBar = () => {
  return (
    <Button
      icon={{name: 'menu', color: '#64a0d9'}}
      buttonStyle={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
});
