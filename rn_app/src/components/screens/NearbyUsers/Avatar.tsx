import React from 'react';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {AnotherUser} from '~/stores/types';
import {FlashesData} from '~/stores/types';

type Props = {
  user: AnotherUser;
  size?: number | 'small' | 'medium' | 'large';
  onAvatarPress?: ({
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

export const Avatar = React.memo(
  ({user, onAvatarPress, size = 'medium'}: Props) => {
    if (user.flashes.entities.length && !user.flashes.isAllAlreadyViewed) {
      return (
        <UserAvatarWithOuter
          image={user.avatar}
          size={size}
          outerType="gradation"
          onPress={() => {
            if (onAvatarPress) {
              onAvatarPress({
                userId: user.id,
                isAllAlreadyViewed: false,
                flashesData: undefined,
              });
            }
          }}
        />
      );
    }

    if (user.flashes.entities.length && user.flashes.isAllAlreadyViewed) {
      return (
        <UserAvatarWithOuter
          image={user.avatar}
          size={size}
          outerType="silver"
          onPress={() => {
            if (onAvatarPress) {
              onAvatarPress({
                userId: user.id,
                isAllAlreadyViewed: true,
                flashesData: user.flashes,
              });
            }
          }}
        />
      );
    }

    return (
      <UserAvatarWithOuter image={user.avatar} size={size} outerType="none" />
    );
  },
);
