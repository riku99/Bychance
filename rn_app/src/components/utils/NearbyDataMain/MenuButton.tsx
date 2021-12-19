import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {MenuView, MenuAction} from '@react-native-menu/menu';
import LinearGradient from 'react-native-linear-gradient';
import {defaultTheme} from '~/theme';

type Props = {
  menuActions: MenuAction[];
  onMenuAction: (v: string) => void;
  title: string;
  menuTitle: string;
};

export const MenuButton = React.memo(
  ({menuActions, onMenuAction, title, menuTitle}: Props) => {
    return (
      <MenuView
        title={menuTitle}
        actions={menuActions}
        onPressAction={(e) => onMenuAction(e.nativeEvent.event)}>
        <TouchableOpacity style={styles.buttonContainer} activeOpacity={1}>
          <LinearGradient
            colors={defaultTheme.mainButtonGradient.colors}
            start={defaultTheme.mainButtonGradient.start}
            end={defaultTheme.mainButtonGradient.end}
            style={styles.buttonContainer}>
            <Text style={styles.titleStyle}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MenuView>
    );
  },
);

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
