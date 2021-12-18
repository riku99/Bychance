import React, {useContext} from 'react';
import {Marker} from 'react-native-maps';

import {UserAvatarWithOuter} from '~/components/utils/AvatarWithOuter';
import {UserData, TabViewContext} from '.';
import {useUserAvatar, useAvatarOuterType} from '~/hooks/users';

type Props = {
  user: UserData;
  size?: number | 'medium';
  marker?: boolean;
};

export const Avatar = React.memo(({user, marker, size = 'medium'}: Props) => {
  const {onAvatarPress, navigateToUserPage} = useContext(TabViewContext);
  const url = useUserAvatar({userId: user.id});
  const outerType = useAvatarOuterType({userId: user.id});

  const onPress = () => {
    if (outerType === 'none') {
      if (marker && navigateToUserPage) {
        navigateToUserPage(user.id);
      } else {
        return;
      }
    }

    if (!onAvatarPress) {
      return;
    }

    if (outerType === 'silver') {
      onAvatarPress({
        type: 'one',
        userId: user.id,
      });
      return;
    }

    if (outerType === 'gradation') {
      onAvatarPress({
        type: 'sequence',
        userId: user.id,
      });
    }
  };

  const renderAvatar = () => {
    return (
      <UserAvatarWithOuter
        image={url}
        onPress={onPress}
        size={size}
        outerType={outerType}
        animation={false}
        fill={outerType === 'none' ? 'transparent' : 'white'}
      />
    );
  };

  if (!marker) {
    return renderAvatar();
  } else {
    return (
      <Marker
        coordinate={{latitude: user.lat, longitude: user.lng}}
        onPress={onPress}>
        {renderAvatar()}
      </Marker>
    );
  }
});
