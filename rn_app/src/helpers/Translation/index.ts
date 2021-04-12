import React from 'react';
import {Animated} from 'react-native';
import {PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';

type Argument = {
  e: PanGestureHandlerGestureEvent;
  translateX: Animated.Value;
  translateY: Animated.Value;
  offsetX: number;
  offsetY: number;
  diffX: React.MutableRefObject<number>;
  diffY: React.MutableRefObject<number>;
};

export const setTranslateAndOffset = ({
  e,
  translateX,
  translateY,
  offsetX,
  offsetY,
  diffX,
  diffY,
}: Argument) => {
  const {translationX, translationY} = e.nativeEvent;
  translateX.setValue(offsetX + translationX);
  translateY.setValue(offsetY + translationY);
  diffX.current = translationX;
  diffY.current = translationY;
};
