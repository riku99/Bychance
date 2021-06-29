import React, {useRef} from 'react';
import {Animated, StyleSheet, View, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Video from 'react-native-video';

import {Source} from './EditSource';
import {setScale, setTotalScale} from '~/helpers/animation/scale';

type Props = {
  source: Source;
  translateX: Animated.Value;
  translateY: Animated.Value;
  onPanGesture: (e: PanGestureHandlerGestureEvent) => void;
  onPanGestureStateChange: (e: PanGestureHandlerGestureEvent) => void;
};

export const AnimatedSource = React.memo(
  ({
    source,
    translateX,
    translateY,
    onPanGesture,
    onPanGestureStateChange,
  }: Props) => {
    const scale = useRef(new Animated.Value(1)).current;
    const totalScale = useRef(1);
    const totalScaleDiff = useRef(0);

    const onPinchGestureEvent = (e: PinchGestureHandlerGestureEvent) => {
      setScale({
        e,
        scale,
        totalDiff: totalScaleDiff,
        totalScale,
      });
    };

    const onPinchHandlerStateChange = (
      e: PinchGestureHandlerStateChangeEvent,
    ) => {
      setTotalScale({
        e,
        totalScale: totalScale,
        totalDiff: totalScaleDiff,
      });
    };

    return (
      <View style={styles.container}>
        <PinchGestureHandler
          onHandlerStateChange={onPinchHandlerStateChange}
          onGestureEvent={onPinchGestureEvent}>
          <View style={[styles.pinchView]}>
            <PanGestureHandler
              onGestureEvent={onPanGesture}
              onHandlerStateChange={onPanGestureStateChange}>
              {source.type === 'image' ? (
                <Animated.Image
                  source={{uri: source.uri}}
                  style={[
                    styles.photoStyle,
                    {transform: [{scale}, {translateX}, {translateY}]},
                  ]}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.photoStyle]}>
                  <Video
                    source={{uri: source.uri}}
                    style={{flex: 1}}
                    repeat={true}
                  />
                </View>
              )}
            </PanGestureHandler>
          </View>
        </PinchGestureHandler>
      </View>
    );
  },
);

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
