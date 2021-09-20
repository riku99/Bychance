import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Badge} from 'react-native-elements';

import {normalStyles} from '~/constants/styles';
import {useDisplayedMenu} from '~/hooks/appState';
import {useGroupBadge} from '~/hooks/appState';

export const MenuBar = React.memo(() => {
  const {setDisplayedMenu} = useDisplayedMenu();
  const {groupBadge} = useGroupBadge();

  return (
    <View>
      <Button
        icon={{name: 'menu', size: 25, color: normalStyles.headerTitleColor}}
        buttonStyle={styles.button}
        onPress={() => {
          setDisplayedMenu(true);
        }}
        activeOpacity={1}
      />
      {groupBadge && (
        <Badge status="error" containerStyle={styles.badgeContainer} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
  badgeContainer: {
    position: 'absolute',
    right: 9,
    top: 6,
  },
});
