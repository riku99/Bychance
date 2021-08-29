import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {UserAvatarWithOuter} from '../Avatar';
import {
  useUserAvatar,
  useAvatarOuterType,
  useMyId,
  useMyAvatar,
} from '~/hooks/users';
import {RootNavigationProp} from '~/navigations/Root';
import {useBackGroundItemVideoPaused} from '~/hooks/appState';

type Props = {
  id: string;
};

export const Avatar = React.memo(({id}: Props) => {
  const isMe = useMyId() === id;
  const myUrl = useMyAvatar();
  const url = useUserAvatar({userId: id});
  const outerType = useAvatarOuterType({userId: id});
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const {setVideoPaused} = useBackGroundItemVideoPaused();

  const onAavatarPress = () => {
    if (outerType === 'none') {
      return;
    }
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
      image={isMe ? myUrl : url}
      opacity={1}
      onPress={onAavatarPress}
      outerType={outerType}
      outerDuration={1300}
    />
  );
});
