import React, {useMemo} from 'react';
import {Avatar} from 'react-native-elements';

import {basicStyles} from '../../constants/styles';
import {UserProfileOuter} from './AvatarOuter';

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
      placeholderStyle={{
        backgroundColor: basicStyles.imageBackGroundColor,
      }}
      size={size}
      activeOpacity={opacity ? opacity : undefined}
      onPress={onPress && onPress}
    />
  );
};

type Props2 = {
  image?: string | null;
  size: 'small' | 'medium' | 'large' | number;
  opacity?: number;
  onPress?: () => any;
  isNeedOuter?: boolean;
  haveFlashes?: boolean;
};

export const UserAvatar2 = React.memo(
  ({image, size, opacity, onPress, isNeedOuter, haveFlashes}: Props2) => {
    const outerType: 'gradation' | 'silver' | 'none' = useMemo(() => {
      if (!isNeedOuter) {
        return 'none';
      }

      if (isNeedOuter && !haveFlashes) {
        return 'silver';
      }

      if (isNeedOuter && haveFlashes) {
        return 'gradation';
      }
      return 'none';
    }, [isNeedOuter, haveFlashes]);

    return (
      <UserProfileOuter avatarSize={size} outerType={outerType}>
        <Avatar
          rounded
          source={image ? {uri: image} : undefined}
          icon={!image ? {name: 'user', type: 'font-awesome'} : undefined}
          containerStyle={!image ? {backgroundColor: '#BDBDBD'} : undefined}
          placeholderStyle={{
            backgroundColor: basicStyles.imageBackGroundColor,
          }}
          size={size}
          activeOpacity={opacity ? opacity : undefined}
          onPress={onPress && onPress}
        />
      </UserProfileOuter>
    );
  },
);
