import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {MenuView, MenuAction} from '@react-native-menu/menu';
import {Button} from 'react-native-elements';

import {normalStyles} from '~/constants/styles/normal';

const menuActions: MenuAction[] = [
  {
    id: '0.1',
    title: 'すぐ近く🕺',
  },
  {
    id: '0.3',
    title: 'ここら辺🪐',
  },
  {
    id: '1',
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
      <Button
        title="検索範囲を変更"
        buttonStyle={styles.buttonContainer}
        titleStyle={styles.titleStyle}
        activeOpacity={1}
      />
    </MenuView>
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
