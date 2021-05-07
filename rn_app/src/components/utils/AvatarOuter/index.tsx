import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const gradientConfig: {
  colors: string[];
  start: {x: number; y: number};
  end: {x: number; y: number};
  baseStyle: ViewStyle;
} = {
  colors: ['#faa0ab', '#ffb86b', '#fc8392', '#fc8392'],
  start: {x: 0.0, y: 1.0},
  end: {x: 1.0, y: 1.0},
  baseStyle: {alignItems: 'center', justifyContent: 'center'},
};

type Props = {
  children: Element;
  avatarSize: number | 'large' | 'medium' | 'small';
  outerType: 'gradation' | 'silver' | 'none';
};

export const UserProfileOuter = React.memo(
  ({children, avatarSize, outerType}: Props) => {
    const outerSize = useMemo(() => {
      if (typeof avatarSize === 'number') {
        return avatarSize + 10;
      } else {
        switch (avatarSize) {
          case 'large':
            return 85;
          case 'medium':
            return 60;
          case 'small':
            return 44;
        }
      }
    }, [avatarSize]);
    return (
      <>
        {outerType === 'gradation' ? (
          <LinearGradient
            colors={gradientConfig.colors}
            start={gradientConfig.start}
            end={gradientConfig.end}
            style={[
              gradientConfig.baseStyle,
              {
                height: outerSize,
                width: outerSize,
                borderRadius: outerSize,
              },
            ]}>
            <View
              style={[
                gradientConfig.baseStyle,
                styles.whiteOuter,
                {
                  height: outerSize - 4,
                  width: outerSize - 4,
                  borderRadius: outerSize - 4,
                },
              ]}>
              {children}
            </View>
          </LinearGradient>
        ) : (
          <View
            style={[
              gradientConfig.baseStyle,
              {
                backgroundColor:
                  outerType === 'silver' ? '#b8b6b6' : 'transparent',
                width: outerSize,
                height: outerSize,
                borderRadius: outerSize,
              },
            ]}>
            <View
              style={[
                gradientConfig.baseStyle,
                styles.whiteOuter,
                {
                  height: outerSize - 4,
                  width: outerSize - 4,
                  borderRadius: outerSize - 4,
                },
              ]}>
              {children}
            </View>
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  whiteOuter: {
    backgroundColor: 'white',
  },
});
