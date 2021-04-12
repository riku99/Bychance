import React from 'react';
import {Animated} from 'react-native';
import {
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';

type SetScale = {
  e: PinchGestureHandlerGestureEvent;
  scale: Animated.Value;
  totalDiff: React.MutableRefObject<number>;
  totalScale: React.MutableRefObject<number>;
};

export const setScale = ({e, scale, totalDiff, totalScale}: SetScale) => {
  const _scale = e.nativeEvent.scale;
  const diff = (1 - _scale) / 3;
  totalDiff.current = diff;
  const value = totalScale.current - diff;
  scale.setValue(value);
};

type SetTotalScale = {
  e: PinchGestureHandlerStateChangeEvent;
  totalDiff: React.MutableRefObject<number>;
  totalScale: React.MutableRefObject<number>;
};

export const setTotalScale = ({e, totalDiff, totalScale}: SetTotalScale) => {
  if (e.nativeEvent.state === State.END || State.CANCELLED) {
    totalScale.current -= totalDiff.current;
    totalDiff.current = 0;
  }
};
