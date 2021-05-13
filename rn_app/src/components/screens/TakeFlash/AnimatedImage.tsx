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

import {Source} from './EditImage';
import {
  setTranslateAndDiff,
  setOffsetAndDiff,
} from '~/helpers/animation/translate';
import {setScale, setTotalScale} from '~/helpers/animation/scale';

type Props = {
  source: Source;
};

export const AnimatedImage = React.memo(({source}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;
  const totalScale = useRef(1);
  const totalScaleDiff = useRef(0);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const offsetX = useRef(0);
  const offsetY = useRef(0);

  const panGestureDiffY = useRef(0);
  const panGestureDiffX = useRef(0);

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

  const onPanGesture = (e: PanGestureHandlerGestureEvent) => {
    setTranslateAndDiff({
      e,
      translateX,
      translateY,
      offsetX: offsetX.current,
      offsetY: offsetY.current,
      diffX: panGestureDiffX,
      diffY: panGestureDiffY,
    });
  };

  const onPanGestureStateChange = (e: PanGestureHandlerGestureEvent) => {
    setOffsetAndDiff({
      e,
      offsetX,
      offsetY,
      diffX: panGestureDiffX,
      diffY: panGestureDiffY,
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
              <Animated.View
                style={[
                  styles.photoStyle,
                  {transform: [{scale}, {translateX}, {translateY}]},
                ]}>
                <Video source={{uri: source.uri}} />
              </Animated.View>
            )}
          </PanGestureHandler>
        </View>
      </PinchGestureHandler>
    </View>
  );
});

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
