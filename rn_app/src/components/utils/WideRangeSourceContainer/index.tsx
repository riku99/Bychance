import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

import {judgeMoreDeviceX} from '~/helpers/device';

type Props = {
  children: Element;
};

// 16:9のソース(画像とか動画)に対応するコンテナ
export const WideRangeSourceContainer = ({children}: Props) => {
  return <View style={[styles.container]}>{children}</View>;
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
