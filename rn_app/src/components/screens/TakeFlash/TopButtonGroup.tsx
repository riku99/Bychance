import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import {BackButton} from '~/components/utils/BackButton';
import {Source} from './EditSource';

type Props = {
  setSketchMode: (v: boolean) => void;
  setColorPickerMode: (v: boolean) => void;
  setTextEditMode: (v: boolean) => void;
  onSaveButtonPress?: () => void;
  type: Source['type'];
};

export const TopButtonGroup = React.memo(
  ({
    setSketchMode,
    setColorPickerMode,
    setTextEditMode,
    onSaveButtonPress,
    type,
  }: Props) => {
    const disabled = useMemo(() => type === 'video', [type]);

    return (
      <View style={styles.container}>
        <BackButton
          icon={{name: 'close', color: 'white', size: 30}}
          buttonStyle={styles.buttonStyle}
        />
        <View style={{flexDirection: 'row'}}>
          <Button
            activeOpacity={1}
            icon={{name: 'save-alt', color: 'white', size: 30}}
            buttonStyle={styles.buttonStyle}
            onPress={onSaveButtonPress}
          />
          <Button
            activeOpacity={1}
            icon={{name: 'color-lens', color: 'white', size: 30}}
            buttonStyle={styles.buttonStyle}
            onPress={() => setColorPickerMode(true)}
            disabled={disabled}
            disabledStyle={styles.buttonStyle}
          />
          <Button
            activeOpacity={1}
            icon={{name: 'create', color: 'white', size: 30}}
            buttonStyle={styles.buttonStyle}
            onPress={() => setSketchMode(true)}
            // onPress={() => dispatch(setCanvasMode({open: true, enabled: true}))}
            disabled={disabled}
            disabledStyle={styles.buttonStyle}
          />
          <Button
            activeOpacity={1}
            icon={{name: 'text-fields', color: 'white', size: 30}}
            buttonStyle={styles.buttonStyle}
            onPress={() => setTextEditMode(true)}
            disabled={disabled}
            disabledStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
  },
});
