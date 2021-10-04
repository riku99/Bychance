import React from 'react';
import {StyleSheet, View, Dimensions, StyleProp, ViewStyle} from 'react-native';

import {judgeMoreDeviceX} from '~/helpers/device';

type Props = {
  children: Element;
  containerStyle?: StyleProp<ViewStyle>;
};

// 16:9のソース(画像とか動画)に対応するコンテナ
export const WideRangeSourceContainer = ({children, containerStyle}: Props) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>;
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
    borderRadius: childrenRedius,
    overflow: 'hidden',
  },
});
