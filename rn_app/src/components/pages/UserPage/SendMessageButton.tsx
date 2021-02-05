import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export const SendMessageButton = React.memo(() => {
  const onPress = () => {
    console.log('fire');
  };
  return (
    <Button
      title="メッセージを送る"
      icon={
        <Icon
          name="send-o"
          size={15}
          color="#2c3e50"
          style={{marginRight: 8}}
        />
      }
      titleStyle={styles.title}
      buttonStyle={styles.button}
      onPress={onPress}
    />
  );
});

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50',
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 33,
  },
});
