import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TriangleColorPicker} from 'react-native-color-picker';
import {Button} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {hsv2rgb} from '~/helpers/colors';

type HsvColor = {h: number; s: number; v: number};

type Props = {
  setTopBackGroundColor: (color: string) => void;
  setBottomBackGroundColor: (color: string) => void;
  setColorPickerMode: (v: boolean) => void;
  topBackGroundColor: string;
  bottomBackGroundColor: string;
};

export const ColorPicker = React.memo(
  ({
    setTopBackGroundColor,
    setBottomBackGroundColor,
    setColorPickerMode,
    topBackGroundColor,
    bottomBackGroundColor,
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

    const {top} = useSafeAreaInsets();

    return (
      <View style={styles.container}>
        <TriangleColorPicker
          style={styles.colorPicker}
          defaultColor={topBackGroundColor}
          onColorChange={(color) => onPickerColorChange({color, which: 'top'})}
        />
        <TriangleColorPicker
          style={styles.colorPicker}
          defaultColor={bottomBackGroundColor}
          onColorChange={(color) =>
            onPickerColorChange({color, which: 'bottom'})
          }
        />
        <View style={[styles.topButtonContaienr, {top}]}>
          <Button
            title="完了"
            titleStyle={{fontSize: 25}}
            buttonStyle={{backgroundColor: 'transparent'}}
            style={{alignSelf: 'flex-end'}}
            onPress={() => setColorPickerMode(false)}
          />
        </View>
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 30,
  },
  colorPicker: {
    width: 180,
    height: 180,
  },
  topButtonContaienr: {
    position: 'absolute',
    width: '95%',
  },
});
