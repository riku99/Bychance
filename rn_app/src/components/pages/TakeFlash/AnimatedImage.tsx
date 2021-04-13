import React from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import {Source} from './EditImage';

type Props = {
  source: Source;
  scale: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  onPinchGestureEvent: (e: PinchGestureHandlerGestureEvent) => void;
  onPinchHandlerStateChange: (e: PinchGestureHandlerStateChangeEvent) => void;
  onPanGesture: (e: PanGestureHandlerGestureEvent) => void;
  onPanGestureStateChange: (e: PanGestureHandlerGestureEvent) => void;
};

// containerのない状態で一回やってみる
export const AnimatedImage = ({
  source,
  translateX,
  translateY,
  scale,
  onPinchGestureEvent,
  onPinchHandlerStateChange,
  onPanGesture,
  onPanGestureStateChange,
}: Props) => {
  return (
    <View style={styles.container}>
      <PinchGestureHandler
        onHandlerStateChange={onPinchHandlerStateChange}
        onGestureEvent={onPinchGestureEvent}>
        <View style={[styles.pinchView]}>
          <PanGestureHandler
            onGestureEvent={onPanGesture}
            onHandlerStateChange={onPanGestureStateChange}>
            <Animated.Image
              source={{uri: source.uri}}
              style={[
                styles.photoStyle,
                {transform: [{scale}, {translateX}, {translateY}]},
              ]}
              resizeMode="contain"
            />
          </PanGestureHandler>
        </View>
      </PinchGestureHandler>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinchView: {
    width,
    height: '100%',
  },
  photoStyle: {
    width,
    height: '100%',
  },
});
