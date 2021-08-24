import React, {useContext} from 'react';
import {useSelector} from 'react-redux';

import {UserAvatarWithOuter} from '~/components/utils/Avatar/index';
import {UserData, TabViewContext} from '.';
import {RootState} from '~/stores';
import {selectUserAvatar} from '~/stores/_users';
import {selectFlashesByIds} from '~/stores/flashes';

type Props = {
  user: UserData;
  size?: number | 'medium';
};

export const Avatar = React.memo(({user, size = 'medium'}: Props) => {
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

  return (
    <UserAvatarWithOuter
      image={url}
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
      outerType={outerType}
    />
  );
});
