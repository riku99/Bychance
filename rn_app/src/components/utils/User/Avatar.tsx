import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {UserAvatarWithOuter} from '~/components/utils/AvatarWithOuter';
import {useAvatarOuterType} from '~/hooks/users';
import {RootNavigationProp} from '~/navigations/Root';
import {useBackGroundItemVideoPaused} from '~/hooks/appState';

type Props = {
  id: string;
  url?: string | null;
};

export const Avatar = React.memo(({id, url}: Props) => {
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
      image={url}
      opacity={1}
      onPress={onAavatarPress}
      outerType={outerType}
      outerDuration={1300}
    />
  );
});
