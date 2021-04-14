import React from 'react';
import {StyleSheet, Animated, TouchableOpacity, Text} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import {TextInfo} from './TextEditor';

type Props = {
  data: TextInfo;
  translateX: Animated.Value;
  translateY: Animated.Value;
  onPanGestureEvent: (e: PanGestureHandlerGestureEvent) => void;
  onPanHandlerStateChange: (e: PanGestureHandlerGestureEvent) => void;
  onLongPress: () => void;
  onPressOut: () => void;
  onPress: () => void;
};

export const AnimatedText = React.memo(
  ({
    data,
    translateX,
    translateY,
    onPanGestureEvent,
    onPanHandlerStateChange,
    onLongPress,
    onPressOut,
    onPress,
  }: Props) => {
    return (
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}>
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
                  backgroundColor: data.backGroundColor
                    ? data.backGroundColor
                    : undefined,
                },
              ]}>
              {data.value}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  },
);

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
