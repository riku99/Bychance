import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {BackButton} from '~/components/utils/BackButton';

type Props = {
  onPartyModePress: () => void;
};

export const TakeFlashTopButtonGroup = ({onPartyModePress}: Props) => {
  return (
    <View style={styles.container}>
      <Button
        icon={<MIcon name="party-mode" style={{color: 'white'}} size={35} />}
        buttonStyle={styles.buttonStyle}
      />

      <BackButton
        icon={{name: 'chevron-right', size: 35, color: 'white'}}
        buttonStyle={styles.buttonStyle}
        onPress={onPartyModePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
  },
});
