import React from 'react';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {AnotherUser} from '~/stores/types';

type Props = {
  user: AnotherUser;
};

export const Avatar = ({user}: Props) => {
  const onPress = () => {};

  if (user.flashes.entities.length && !user.flashes.isAllAlreadyViewed) {
    return (
      <UserAvatarWithOuter
        image={user.avatar}
        size="medium"
        outerType="gradation"
        onPress={onPress}
      />
    );
  }

  if (user.flashes.entities.length && user.flashes.isAllAlreadyViewed) {
    return (
      <UserAvatarWithOuter
        image={user.avatar}
        size="medium"
        outerType="silver"
        onPress={onPress}
      />
    );
  }

  return (
    <UserAvatarWithOuter image={user.avatar} size="medium" outerType="none" />
  );
};
