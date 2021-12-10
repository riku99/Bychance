import React, {useMemo} from 'react';
import {StyleProp} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {CircularProgressGradient} from '~/components/utils/CircularProgressGradient';

import {UserAvatar} from '~/components/utils/Avatar';

type Props = {
  image?: string | null;
  size: 'small' | 'medium' | 'large' | number;
  opacity?: number;
  onPress?: () => any;
  containerStyle?: StyleProp<ImageStyle>;
  outerType: 'gradation' | 'silver' | 'none';
  outerDuration?: number;
  animation?: boolean;
  fill?: string;
};

const OUTER_BLANK = 4;

export const UserAvatarWithOuter = React.memo(
  ({
    image,
    size,
    onPress,
    outerType,
    opacity = 1,
    animation = true,
    fill = 'white',
  }: Props) => {
    const outerSize = useMemo(() => {
      if (typeof size === 'number') {
        return size;
      } else {
        switch (size) {
          case 'large':
            return 75;
          case 'medium':
            return 50;
          case 'small':
            return 34;
        }
      }
    }, [size]);

    const tintColor = useMemo(() => {
      switch (outerType) {
        case 'gradation':
          return '#faa5e5';
        case 'silver':
          return '#b8b6b6';
        default:
          return 'transparent';
      }
    }, [outerType]);

    return (
      <CircularProgressGradient
        size={outerSize / 2 + OUTER_BLANK}
        strokeWidth={3}
        blank={OUTER_BLANK}
        fill={fill}
        animation={animation}
        tintColor={tintColor}
        tintColorSecondary={outerType === 'gradation' ? '#efa5fa' : undefined}>
        <UserAvatar
          image={image}
          size={size}
          opacity={opacity}
          onPress={onPress}
        />
      </CircularProgressGradient>
    );
  },
);
