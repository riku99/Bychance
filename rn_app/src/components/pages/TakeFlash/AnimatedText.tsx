import React from 'react';
import {StyleSheet, Animated, TouchableOpacity, Text} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import {TextInfo} from './TextEditor';

type Props = {
  data: TextInfo;
  onPanGestureEvent: (e: PanGestureHandlerGestureEvent) => void;
  onPanHandlerStateChange: (e: PanGestureHandlerGestureEvent) => void;
  translateX: Animated.Value;
  translateY: Animated.Value;
  onLongPress: () => void;
  onPressOut: () => void;
  onPress: () => void;
};

export const AnimatedText = ({
  data,
  onPanGestureEvent,
  onPanHandlerStateChange,
  translateX,
  translateY,
  onLongPress,
  onPressOut,
  onPress,
}: Props) => {
  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      key={data.id}>
      <Animated.View
        style={[
          styles.textContainer,
          {top: data.y, left: data.x},
          {
            transform: [
              {
                translateX,
              },
              {
                translateY,
              },
            ],
          },
        ]}>
        <TouchableOpacity
          activeOpacity={1}
          //delayLongPress={1000}
          onLongPress={onLongPress}
          onPressOut={onPressOut}
          onPress={onPress}>
          <Text
            style={[
              styles.text,
              {
                fontSize: data.fontSize,
                color: data.fontColor,
                width: data.width,
              },
            ]}>
            {data.value}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
