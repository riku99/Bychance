import React from 'react';
import {Avatar} from 'react-native-elements';

type Props = {
  image?: string | null;
  size: 'small' | 'medium' | 'large' | 'xlarge' | number;
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
      size={size}
      activeOpacity={opacity ? opacity : undefined}
      onPress={onPress && onPress}
    />
  );
};
