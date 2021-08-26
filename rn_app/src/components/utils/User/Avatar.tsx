import React from 'react';

import {UserAvatarWithOuter} from '../Avatar';
import {useUserAvatar, useAvatarOuterType} from '~/hooks/users';

type Props = {
  id: string;
  avatar: string | null;
};

export const Avatar = React.memo(({id, avatar}: Props) => {
  const url = useUserAvatar({userId: id, avatarUrl: avatar});
  const outerType = useAvatarOuterType({userId: id});
  return (
    <UserAvatarWithOuter
      size="large"
      image={url}
      opacity={1}
      onPress={() => {}}
      outerType={outerType}
    />
  );
});
