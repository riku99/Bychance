import React, {useMemo} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {judgeMoreDeviceX} from '~/helpers/device';

type Props = {
  children: Element;
};

// 16:9のソース(画像とか動画)に対応するコンテナ
export const WideRangeSourceContainer = ({children}: Props) => {
  const {top} = useSafeAreaInsets();
  const cameraContainerTop = useMemo(() => (moreDviceX ? top : 0), [top]);
  return (
    <View style={[styles.container, {top: cameraContainerTop}]}>
      {children}
    </View>
  );
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
