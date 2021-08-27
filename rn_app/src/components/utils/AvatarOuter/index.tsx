import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress-gradient';

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
  outerDuration?: number;
};

export const UserProfileOuter = React.memo(
  ({children, avatarSize, outerType, outerDuration = 0}: Props) => {
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

    const tintColor = useMemo(() => {
      switch (outerType) {
        case 'gradation':
          return '#fab237';
        case 'silver':
          return '#b8b6b6';
        default:
          return 'transparent';
      }
    }, [outerType]);
    return (
      <AnimatedCircularProgress
        size={outerSize}
        width={3}
        fill={100}
        duration={outerDuration}
        rotation={0}
        tintColor={tintColor}
        tintColorSecondary={outerType === 'gradation' ? '#fa8e9b' : undefined}>
        {() => (
          <View
            style={[
              gradientConfig.baseStyle,
              styles.whiteOuter,
              {
                height: outerSize - 2,
                width: outerSize - 2,
                borderRadius: outerSize - 2,
              },
            ]}>
            {children}
          </View>
        )}
      </AnimatedCircularProgress>
      // <>
      //   {outerType === 'gradation' ? (
      //     // <LinearGradient
      //     //   colors={gradientConfig.colors}
      //     //   start={gradientConfig.start}
      //     //   end={gradientConfig.end}
      //     //   style={[
      //     //     gradientConfig.baseStyle,
      //     //     {
      //     //       height: outerSize,
      //     //       width: outerSize,
      //     //       borderRadius: outerSize,
      //     //     },
      //     //   ]}>
      //     <AnimatedCircularProgress
      //       size={outerSize}
      //       width={3}
      //       fill={100}
      //       duration={outerDuration}
      //       rotation={0}
      //       tintColor={tintColor}
      //       tintColorSecondary={
      //         outerType === 'gradation' ? '#fa8e9b' : undefined
      //       }>
      //       {() => (
      //         <View
      //           style={[
      //             gradientConfig.baseStyle,
      //             styles.whiteOuter,
      //             {
      //               height: outerSize - 5,
      //               width: outerSize - 5,
      //               borderRadius: outerSize - 5,
      //             },
      //           ]}>
      //           {children}
      //         </View>
      //       )}
      //     </AnimatedCircularProgress>
      //   ) : (
      //     // </LinearGradient>
      //     <View
      //       style={[
      //         gradientConfig.baseStyle,
      //         {
      //           backgroundColor:
      //             outerType === 'silver' ? '#b8b6b6' : 'transparent',
      //           width: outerSize,
      //           height: outerSize,
      //           borderRadius: outerSize,
      //         },
      //       ]}>
      //       <View
      //         style={[
      //           gradientConfig.baseStyle,
      //           styles.whiteOuter,
      //           {
      //             height: outerSize - 5,
      //             width: outerSize - 5,
      //             borderRadius: outerSize - 5,
      //           },
      //         ]}>
      //         {children}
      //       </View>
      //     </View>
      //   )}
      // </>
    );
  },
);

const styles = StyleSheet.create({
  whiteOuter: {
    backgroundColor: 'white',
  },
});
