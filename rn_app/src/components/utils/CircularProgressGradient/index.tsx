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
  children: Element;
  size: number;
  strokeWidth: number;
  blank?: number;
  fill?: string;
  tintColor: string;
  tintColorSecondary?: string;
  animation?: boolean;
  duration?: number;
};

export const CircularProgressGradient = React.memo(
  ({
    size,
    strokeWidth,
    fill,
    children,
    tintColor,
    tintColorSecondary,
    animation = true,
    blank = 0,
    duration = 950,
  }: Props) => {
    const HALF_WIDTH = size + strokeWidth;
    const CIRCUMFERENCE = 2 * size * Math.PI;
    const progressValue = useSharedValue(animation ? CIRCUMFERENCE : 0);

    const animatedProgress = useAnimatedProps(() => {
      return {
        strokeDashoffset: progressValue.value,
      };
    });

    useEffect(() => {
      if (animation) {
        progressValue.value = withTiming(0, {
          duration,
        });
      }
    }, [progressValue, animation, duration]);

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
              <Stop stopColor={tintColor} stopOpacity="1" offset="0%" />
              <Stop
                stopColor={tintColorSecondary ? tintColorSecondary : tintColor}
                stopOpacity="1"
                offset="100%"
              />
            </LinearGradient>
          </Defs>
          <G rotation="-90">
            <AnimatedCircle
              cx={0}
              cy={0}
              r={size}
              stroke={
                tintColor === 'transparent' ? undefined : 'url(#gradient)'
              }
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
