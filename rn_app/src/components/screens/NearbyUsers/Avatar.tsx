import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {UserData, TabViewContext} from '.';
import {RootState} from '~/stores';
import {selectUserAvatar} from '~/stores/_users';
import {selectFlashesByIds} from '~/stores/flashes';

type Props = {
  user: UserData;
  size?: number | 'medium';
  marker?: boolean;
};

export const Avatar = React.memo(({user, marker, size = 'medium'}: Props) => {
  const {onAvatarPress} = useContext(TabViewContext);
  const storedUrl = useSelector((state: RootState) =>
    selectUserAvatar(state, user.id),
  );
  const url = storedUrl ? storedUrl : user.avatar;

  const flashes = useSelector((state: RootState) =>
    selectFlashesByIds(state, user.flashIds),
  );

  const outerType = !flashes.length
    ? 'none'
    : flashes.every((f) => f.viewerViewed)
    ? 'silver'
    : 'gradation';

  const onPress = () => {
    if (!onAvatarPress || outerType === 'none') {
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
