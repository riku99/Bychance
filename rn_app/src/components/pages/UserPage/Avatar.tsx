import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  RootNavigationProp,
  PartialFlashesDataAndUser,
} from '../../../screens/types';
import {UserAvatarWithOuter} from '../../utils/Avatar';

type AvatarProps = {
  source: string | null;
  flashesDataAndUser: PartialFlashesDataAndUser;
  outerType: 'gradation' | 'silver' | 'none';
};

export const Avatar = React.memo(
  ({source, flashesDataAndUser, outerType}: AvatarProps) => {
    const navigation = useNavigation<RootNavigationProp<'Tab'>>();
    const onUserAvatarPress = () => {
      navigation.push('Flashes', {
        screen: 'Flashes',
        params: {
          FlashesDataAndUserArray: [flashesDataAndUser],
          startingIndex: 0,
        },
      });
    };

    return (
      <UserAvatarWithOuter
        size="large"
        image={source}
        onPress={onUserAvatarPress}
        outerType={outerType}
      />
    );
  },
);
