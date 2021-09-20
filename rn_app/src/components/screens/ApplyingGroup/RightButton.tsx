import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {defaultTheme} from '~/theme';

export const RightButton = React.memo(() => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('UserConfig', {goTo: 'group'});
  };

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>設定</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    marginRight: 6,
  },
  text: {
    color: defaultTheme.darkGray,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
