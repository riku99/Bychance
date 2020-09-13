import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

export const Hooter = () => {
  return (
    <View style={styles.hooter}>
      <Button icon={{name: 'search', size: 25}} buttonStyle={styles.button} />
      <Button
        icon={{name: 'chat-bubble-outline', size: 25}}
        buttonStyle={styles.button}
      />
      <Button
        icon={{name: 'add-photo-alternate', size: 25}}
        buttonStyle={styles.button}
      />
      <Button
        icon={{name: 'person-outline', size: 25}}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
    backgroundColor: 'white',
    borderTopColor: '#e8e8e8',
    borderTopWidth: 1,
  },
  button: {
    backgroundColor: 'white',
  },
});
