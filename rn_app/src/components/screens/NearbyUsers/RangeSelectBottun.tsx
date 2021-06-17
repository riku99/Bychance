import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {MenuView, MenuAction} from '@react-native-menu/menu';
import LinearGradient from 'react-native-linear-gradient';

import {mainButtonGradientConfig} from '~/constants/styles';

const menuActions: MenuAction[] = [
  {
    id: '0.3',
    title: 'すぐ近く🕺',
  },
  {
    id: '1.5',
    title: 'ここら辺🪐',
  },
  {
    id: '3.5',
    title: 'ちょい広め💫',
  },
];

type Props = {
  setRange: (n: number) => void;
};

export const RangeSelectButton = React.memo(({setRange}: Props) => {
  const onMenuAction = useCallback(
    (id: string) => {
      setRange(Number(id));
    },
    [setRange],
  );

  return (
    <MenuView
      title="検索範囲を変更"
      actions={menuActions}
      onPressAction={(e) => onMenuAction(e.nativeEvent.event)}>
      <TouchableOpacity style={styles.buttonContainer} activeOpacity={1}>
        <LinearGradient
          colors={mainButtonGradientConfig.colors}
          start={mainButtonGradientConfig.start}
          end={mainButtonGradientConfig.end}
          style={styles.buttonContainer}>
          <Text style={styles.titleStyle}>検索範囲を変更</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MenuView>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  titleStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
