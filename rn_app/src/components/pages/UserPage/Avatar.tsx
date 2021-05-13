import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {UserAvatarWithOuter} from '../../utils/Avatar';
import {FlashesStackParamList} from '../../../screens/Flashes';
import {RootNavigationProp} from '~/screens/Root';

type AvatarProps = {
  source: string | null;
  outerType: 'gradation' | 'silver' | 'none';
  flashesNavigationParam?: FlashesStackParamList['Flashes'];
};

export const Avatar = React.memo(
  ({source, outerType, flashesNavigationParam}: AvatarProps) => {
    const navigation = useNavigation<RootNavigationProp<'Tab'>>();
    const onUserAvatarPress = () => {
      if (flashesNavigationParam) {
        navigation.push('Flashes', {
          screen: 'Flashes',
          params: flashesNavigationParam,
        });
      }
    };

    return (
      <UserAvatarWithOuter
        size="large"
        image={source}
        opacity={1}
        onPress={onUserAvatarPress}
        outerType={outerType}
      />
    );
  },
);
