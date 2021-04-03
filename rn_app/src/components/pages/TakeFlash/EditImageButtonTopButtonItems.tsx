import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import {TriangleColorPicker} from 'react-native-color-picker';

import {BackButton} from '~/components/utils/BackButton';
import {hsv2rgb} from '~/helpers/colors';

type Props = {
  setSketchMode: (v: boolean) => void;
  setTopBackGroundColor: (color: string) => void;
  setBottomBackGroundColor: (color: string) => void;
};

type HsvColor = {h: number; s: number; v: number};

export const EditImageTopButtonItems = ({
  setSketchMode,
  setTopBackGroundColor,
  setBottomBackGroundColor,
}: Props) => {
  const onPickerColorChange = ({
    color,
    which,
  }: {
    color: HsvColor;
    which: 'top' | 'bottom';
  }) => {
    const result = hsv2rgb(color.h, color.s, color.v);
    const rgb = result.rgb;
    switch (which) {
      case 'top':
        setTopBackGroundColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        return;
      case 'bottom':
        setBottomBackGroundColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
    }
  };

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
        />
        <Button
          icon={{name: 'create', color: 'white', size: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
          onPress={() => setSketchMode(true)}
        />
        <Button
          icon={{name: 'text-fields', color: 'white', size: 30}}
          buttonStyle={{backgroundColor: 'transparent'}}
        />
      </View>
      <View style={styles.pickerContainer}>
        <TriangleColorPicker
          style={{width: 180, height: 180}}
          onColorChange={(color) => onPickerColorChange({color, which: 'top'})}
        />
        <TriangleColorPicker
          style={{width: 180, height: 180}}
          onColorChange={(color) =>
            onPickerColorChange({color, which: 'bottom'})
          }
        />
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    width,
    height,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 20,
  },
});
