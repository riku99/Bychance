import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {RootNavigationProp} from '../../../screens/types';
import {normalStyles} from '~/constants/styles/normal';

export const TakeFlashButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onPress = () => {
    navigation.push('TakeFlash');
  };
  return (
    <Button
      icon={<MIcon name="flash-on" size={27} style={styles.buttonIcon} />}
      buttonStyle={styles.button}
      onPress={onPress}
    />
  );
});

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    backgroundColor: normalStyles.mainColor,
  },
  buttonIcon: {color: 'white'},
});
