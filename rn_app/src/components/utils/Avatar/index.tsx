import React from 'react';
import {Pressable} from 'react-native';
import {Avatar, AvatarProps} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import {defaultTheme} from '~/theme';

import {UserProfileOuter} from '../AvatarOuter';

const avatarSizes = {
  small: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};

type Props = {
  image?: string | null;
  size: 'small' | 'medium' | 'large' | number;
  opacity?: number;
  onPress?: () => any;
  containerStyle?: AvatarProps['containerStyle'];
};

export const UserAvatar = React.memo(
  ({image, size, onPress, containerStyle, opacity = 1}: Props) => {
    const sizeNumber = typeof size === 'string' ? avatarSizes[size] : size;

    if (!image) {
      return (
        <Avatar
          rounded
          icon={!image ? {name: 'user', type: 'font-awesome'} : undefined}
          containerStyle={
            !image
              ? [{backgroundColor: '#BDBDBD'}, containerStyle]
              : containerStyle
          }
          placeholderStyle={{
            backgroundColor: defaultTheme.imageBackGroundColor,
          }}
          size={size}
          activeOpacity={opacity ? opacity : undefined}
          onPress={onPress && onPress}
        />
      );
    }
    return (
      <Pressable style={{borderRadius: sizeNumber}} onPress={onPress}>
        <FastImage
          source={{uri: image}}
          style={{
            width: sizeNumber,
            height: sizeNumber,
            borderRadius: sizeNumber,
            backgroundColor: defaultTheme.imageBackGroundColor,
          }}
        />
      </Pressable>
    );
  },
);

type _Props = Props & {
  outerType: 'gradation' | 'silver' | 'none';
  outerDuration?: number;
};

export const UserAvatarWithOuter = React.memo(
  ({image, size, onPress, outerType, outerDuration, opacity = 1}: _Props) => {
    return (
      <UserProfileOuter
        avatarSize={size}
        outerType={outerType}
        outerDuration={outerDuration}>
        <UserAvatar
          image={image}
          size={size}
          opacity={opacity}
          onPress={onPress}
        />
      </UserProfileOuter>
    );
  },
);
