import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {judgeMoreDeviceX} from '~/helpers/device';

type Props = {
  children: Element;
};

export const FlashContainer = ({children}: Props) => {
  const {top} = useSafeAreaInsets();
  return <View style={[styles.container, {marginTop: top}]}>{children}</View>;
};

const {width} = Dimensions.get('screen');

const partsWidth = width / 9;
const sourceHeight = partsWidth * 16;

const moreDviceX = judgeMoreDeviceX();
const childrenRedius = moreDviceX ? 15 : 0;

const styles = StyleSheet.create({
  container: {
    width,
    height: sourceHeight,
    overflow: 'hidden',
    borderRadius: childrenRedius,
  },
});
