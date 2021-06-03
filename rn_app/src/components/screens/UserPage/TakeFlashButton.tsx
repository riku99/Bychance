import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {RootNavigationProp} from '~/screens/Root';
import {mainButtonGradientConfig} from '~/constants/styles';

export const TakeFlashButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onPress = () => {
    navigation.push('TakeFlash');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={1}>
      <LinearGradient
        colors={mainButtonGradientConfig.colors}
        start={mainButtonGradientConfig.start}
        end={mainButtonGradientConfig.end}
        style={styles.button}>
        <MIcon name="flash-on" size={27} style={styles.buttonIcon} />
      </LinearGradient>
    </TouchableOpacity>
  );
});

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {color: 'white'},
});
