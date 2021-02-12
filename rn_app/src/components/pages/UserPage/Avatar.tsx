import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {RootNavigationProp} from '../../../screens/types';
import {UserAvatarWithOuter} from '../../utils/Avatar';

type AvatarProps = {
  source: string | null;
  outerType: 'gradation' | 'silver' | 'none';
};

export const Avatar = React.memo(({source, outerType}: AvatarProps) => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const onUserAvatarPress = () => {
    navigation.push('Flashes', {
      screen: 'Flashes',
      params: {
        isMyData: true,
        startingIndex: 0,
        dataArray: [{userData: {userId: 1}, flashesData: undefined}],
      },
    });
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
});
