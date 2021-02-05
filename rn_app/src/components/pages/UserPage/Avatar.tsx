import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  RootNavigationProp,
  PartialFlashesDataAndUser,
} from '../../../screens/types';
import {UserAvatar2} from '../../utils/Avatar';

type AvatarProps = {
  source: string | null;
  flashesDataAndUser: PartialFlashesDataAndUser;
  isNeedOuter?: boolean;
  showGradationOuter: boolean;
};

export const Avatar = React.memo(
  ({
    source,
    isNeedOuter,
    showGradationOuter,
    flashesDataAndUser,
  }: AvatarProps) => {
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
      <UserAvatar2
        size="large"
        image={source}
        isNeedOuter={isNeedOuter}
        haveFlashes={showGradationOuter}
        onPress={onUserAvatarPress}
      />
    );
  },
);
