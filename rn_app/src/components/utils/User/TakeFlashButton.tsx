import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {RootNavigationProp} from '~/navigations/Root';
import {defaultTheme} from '~/theme';

export const TakeFlashButton = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onPress = () => {
    navigation.navigate('TakeFlash');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={1}>
      <LinearGradient
        colors={defaultTheme.mainButtonGradient.colors}
        start={defaultTheme.mainButtonGradient.start}
        end={defaultTheme.mainButtonGradient.end}
        style={styles._button}>
        <MIcon name="flare" size={27} style={styles.buttonIcon} />
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
    shadowColor: '#000',
    shadowOffset: {
      width: 1.8,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
  },
  _button: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {color: 'white'},
});
