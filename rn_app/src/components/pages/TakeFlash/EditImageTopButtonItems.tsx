import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import {BackButton} from '~/components/utils/BackButton';

type Props = {
  setSketchMode: (v: boolean) => void;
  setColorPickerMode: (v: boolean) => void;
  setTextEditMode: (v: boolean) => void;
};

type HsvColor = {h: number; s: number; v: number};

export const EditImageTopButtonItems = ({
  setSketchMode,
  setColorPickerMode,
  setTextEditMode,
}: Props) => {
  return (
    <View style={styles.container}>
      <BackButton
        icon={{name: 'close', color: 'white', size: 30}}
        buttonStyle={{backgroundColor: 'transparent'}}
      />
      <View style={{flexDirection: 'row'}}>
        <Button
          icon={{name: 'color-lens', color: 'white', size: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => setColorPickerMode(true)}
        />
        <Button
          icon={{name: 'create', color: 'white', size: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => setSketchMode(true)}
        />
        <Button
          icon={{name: 'text-fields', color: 'white', size: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => setTextEditMode(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});
