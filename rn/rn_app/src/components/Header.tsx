import React from 'react';
import {StyleSheet} from 'react-native';
import {Header, Button} from 'react-native-elements';

export const CustomHeader = () => {
  return (
    <Header
      centerComponent={{text: 'MyApp', style: {color: '#64a0d9'}}}
      rightComponent={
        <Button
          icon={{name: 'menu', color: '#64a0d9'}}
          buttonStyle={styles.button}
        />
      }
      containerStyle={styles.header}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: 'white',
  },
});
