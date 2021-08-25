import React from 'react';

import {UserAvatarWithOuter} from '../Avatar';

type AvatarProps = {
  source: string | null;
  outerType: 'gradation' | 'silver' | 'none';
  onPress?: () => void;
};

type Props = {
  user: {
    id: string;
    avatar: string | null;
  };
};

export const Avatar = React.memo(
  ({source, outerType, onPress}: AvatarProps) => {
    return (
      <UserAvatarWithOuter
        size="large"
        image={source}
        opacity={1}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
        outerType={outerType}
      />
    );
  },
);
