import React, {useLayoutEffect, useMemo} from 'react';
import {RouteProp, NavigationProp} from '@react-navigation/native';

import {RootStackParamList} from '~/screens/Root';

type Props = {
  route: RouteProp<RootStackParamList, 'PrivateConfig'>;
  navigation: NavigationProp<RootStackParamList, 'PrivateConfig'>;
};

export const PrivateConfig = React.memo(({route, navigation}: Props) => {
  const {goTo} = route.params;

  const headerTitle = useMemo(() => {
    switch (goTo) {
      case 'location':
        return 'プライベートゾーンの設定';
      case 'time':
        return 'プライベートタイムの設定';
    }
  }, [goTo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [headerTitle, navigation]);

  return null;
});
