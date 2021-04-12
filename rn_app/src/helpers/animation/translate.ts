import React from 'react';
import {Animated} from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';

type TranslateAndDiff = {
  e: PanGestureHandlerGestureEvent;
  translateX: Animated.Value;
  translateY: Animated.Value;
  offsetX: number;
  offsetY: number;
  diffX: React.MutableRefObject<number>;
  diffY: React.MutableRefObject<number>;
};

export const setTranslateAndDiff = ({
  e,
  translateX,
  translateY,
  offsetX,
  offsetY,
  diffX,
  diffY,
}: TranslateAndDiff) => {
  const {translationX, translationY} = e.nativeEvent;
  translateX.setValue(offsetX + translationX);
  translateY.setValue(offsetY + translationY);
  diffX.current = translationX;
  diffY.current = translationY;
};

type OffsetAndDiff = {
  e: PanGestureHandlerGestureEvent;
  offsetX?: React.MutableRefObject<number>;
  offsetY?: React.MutableRefObject<number>;
  offsetObj?: {x: number; y: number};
  diffX: React.MutableRefObject<number>;
  diffY: React.MutableRefObject<number>;
};

export const setOffsetAndDiff = ({
  e,
  offsetX,
  offsetY,
  offsetObj,
  diffX,
  diffY,
}: OffsetAndDiff) => {
  if (e.nativeEvent.state === State.END || State.CANCELLED) {
    if (offsetX && offsetY) {
      offsetX.current += diffX.current;
      offsetY.current += diffY.current;
    }
    if (offsetObj) {
      offsetObj.x += diffX.current;
      offsetObj.y += diffY.current;
    }
    diffX.current = 0;
    diffY.current = 0;
  }
};
