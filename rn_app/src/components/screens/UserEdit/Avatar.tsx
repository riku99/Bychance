import React from 'react';
import {TouchableOpacity} from 'react-native';

import {UserAvatarWithOuter} from '~/components/utils/Avatar';

type Props = {
  avatar: string | null;
  onPress: () => void;
};

export const Avatar = React.memo(({avatar, onPress}: Props) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <UserAvatarWithOuter
        image={avatar ? avatar : null}
        size="large"
        opacity={1}
        outerType="none"
      />
    </TouchableOpacity>
  );
});
