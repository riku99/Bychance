import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle, LinearGradient, Defs, Stop, G} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  strokeWidth: number;
  blank?: number;
  fill?: string;
  children: Element;
};

export const CircularProgressGradient = React.memo(
  ({size, strokeWidth, fill, children, blank = 0}: Props) => {
    const HALF_WIDTH = size + strokeWidth;
    const CIRCUMFERENCE = 2 * size * Math.PI;
    const progressValue = useSharedValue(CIRCUMFERENCE);
    // const dimensions = (size - blank) * 2;

    const animatedProgress = useAnimatedProps(() => {
      return {
        strokeDashoffset: progressValue.value,
      };
    });

    useEffect(() => {
      progressValue.value = withTiming(0, {
        duration: 950,
      });
    }, [progressValue]);

    return (
      <View>
        <Svg
          width={HALF_WIDTH * 2}
          height={HALF_WIDTH * 2}
          viewBox={`${-HALF_WIDTH} ${-HALF_WIDTH} ${2 * HALF_WIDTH} ${
            2 * HALF_WIDTH
          }`}>
          <Defs>
            <LinearGradient id="gradient">
              <Stop stopColor="#ff9791" stopOpacity="1" offset="0%" />
              <Stop stopColor="#f7b57c" stopOpacity="1" offset="100%" />
            </LinearGradient>
          </Defs>
          <G rotation="-90">
            <AnimatedCircle
              cx={0}
              cy={0}
              r={size}
              stroke={'url(#gradient)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProgress}
              fill={fill}
            />
          </G>
        </Svg>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              top: strokeWidth + blank,
              left: strokeWidth + blank,
              overflow: 'hidden',
            },
          ]}>
          {children}
        </View>
      </View>
    );
  },
);
