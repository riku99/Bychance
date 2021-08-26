import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import {normalStyles} from '~/constants/styles';
import {useDisplayedMenu} from '~/hooks/appState';

export const MenuBar = React.memo(() => {
  const {setDisplayedMenu} = useDisplayedMenu();

  return (
    <Button
      icon={{name: 'menu', size: 25, color: normalStyles.headerTitleColor}}
      buttonStyle={styles.button}
      onPress={() => {
        setDisplayedMenu(true);
      }}
      activeOpacity={1}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
});
