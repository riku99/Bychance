import React from 'react';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {AnotherUser} from '~/stores/types';
import {FlashesData} from '~/components/pages/Flashes/types';

type Props = {
  user: AnotherUser;
  onAvatarPress: ({
    isAllAlreadyViewed,
    userId,
    flashesData,
  }:
    | {
        isAllAlreadyViewed: true;
        userId: string;
        flashesData: FlashesData;
      }
    | {
        isAllAlreadyViewed: false;
        userId: string;
        flashesData: undefined;
      }) => void;
};

export const Avatar = React.memo(({user, onAvatarPress}: Props) => {
  if (user.flashes.entities.length && !user.flashes.isAllAlreadyViewed) {
    return (
      <UserAvatarWithOuter
        image={user.avatar}
        size="medium"
        outerType="gradation"
        onPress={() => {
          onAvatarPress({
            userId: user.id,
            isAllAlreadyViewed: false,
            flashesData: undefined,
          });
        }}
      />
    );
  }

  if (user.flashes.entities.length && user.flashes.isAllAlreadyViewed) {
    return (
      <UserAvatarWithOuter
        image={user.avatar}
        size="medium"
        outerType="silver"
        onPress={() => {
          onAvatarPress({
            userId: user.id,
            isAllAlreadyViewed: true,
            flashesData: user.flashes,
          });
        }}
      />
    );
  }

  return (
    <UserAvatarWithOuter image={user.avatar} size="medium" outerType="none" />
  );
});
