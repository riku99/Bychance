import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {UserAvatarWithOuter} from '../Avatar';
import {useUserAvatar, useAvatarOuterType} from '~/hooks/users';
import {RootNavigationProp} from '~/navigations/Root';
import {useBackGroundItemVideoPaused} from '~/hooks/appState';

type Props = {
  id: string;
  avatar: string | null;
};

export const Avatar = React.memo(({id, avatar}: Props) => {
  const url = useUserAvatar({userId: id, avatarUrl: avatar});
  const outerType = useAvatarOuterType({userId: id});
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const {setVideoPaused} = useBackGroundItemVideoPaused();

  const onAavatarPress = () => {
    setVideoPaused(true);
    navigation.navigate('Flashes', {
      screen: 'Flashes',
      params: {
        startingIndex: 0,
        userIds: [id],
      },
    });
  };

  return (
    <UserAvatarWithOuter
      size="large"
      image={url}
      opacity={1}
      onPress={onAavatarPress}
      outerType={outerType}
    />
  );
});
