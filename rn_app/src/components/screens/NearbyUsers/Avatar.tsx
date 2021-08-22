import React, {useContext} from 'react';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {UserData, TabViewContext} from '.';

type Props = {
  user: UserData;
  size?: number | 'medium';
};

export const Avatar = React.memo(({user, size = 'medium'}: Props) => {
  const {onAvatarPress} = useContext(TabViewContext);
  return (
    <UserAvatarWithOuter
      image={user.avatar}
      onPress={() => {
        if (!onAvatarPress) {
          return;
        }
        const userData = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        if (!user.flashesData.viewedAllFlashes) {
          onAvatarPress({
            viewedAllFlashes: false,
            flashes: undefined,
            user: userData,
          });
        } else {
          onAvatarPress({
            viewedAllFlashes: true,
            flashes: user.flashesData.entities,
            user: userData,
          });
        }
      }}
      size={size}
      outerType={
        !user.flashesData.entities.length
          ? 'none'
          : user.flashesData.viewedAllFlashes
          ? 'silver'
          : 'gradation'
      }
    />
  );
});
