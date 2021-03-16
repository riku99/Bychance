import React from 'react';
import {Avatar} from 'react-native-elements';

import {normalStyles} from '../../../constants/styles/normal';
import {UserProfileOuter} from '../AvatarOuter';

type Props = {
  image?: string | null;
  size: 'small' | 'medium' | 'large' | number;
  opacity?: number;
  onPress?: () => any;
};

export const UserAvatar = ({image, size, opacity, onPress}: Props) => {
  return (
    <Avatar
      rounded
      source={image ? {uri: image} : undefined}
      icon={!image ? {name: 'user', type: 'font-awesome'} : undefined}
      containerStyle={!image ? {backgroundColor: '#BDBDBD'} : undefined}
      placeholderStyle={{
        backgroundColor: normalStyles.imageBackGroundColor,
      }}
      size={size}
      activeOpacity={opacity ? opacity : undefined}
      onPress={onPress && onPress}
    />
  );
};

type _Props = Props & {outerType: 'gradation' | 'silver' | 'none'};

export const UserAvatarWithOuter = React.memo(
  ({image, size, opacity, onPress, outerType}: _Props) => {
    return (
      <UserProfileOuter avatarSize={size} outerType={outerType}>
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
