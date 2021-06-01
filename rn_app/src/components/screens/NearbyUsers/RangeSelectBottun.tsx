import React from 'react';
import {StyleSheet} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import {Button} from 'react-native-elements';

import {normalStyles} from '~/constants/styles/normal';

type Props = {};

export const RangeSelectButton = React.memo(() => {
  return (
    <Button
      title="検索範囲を変更"
      buttonStyle={styles.buttonContainer}
      titleStyle={styles.titleStyle}
      activeOpacity={1}
    />
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: normalStyles.mainColor,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  titleStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
