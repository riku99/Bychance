import React, {useLayoutEffect, useMemo} from 'react';
import {RouteProp, NavigationProp} from '@react-navigation/native';

import {RootStackParamList} from '~/screens/Root';
import {Zone} from './Zone';
import {Time} from './Time';

type Props = {
  route: RouteProp<RootStackParamList, 'PrivateConfig'>;
  navigation: NavigationProp<RootStackParamList, 'PrivateConfig'>;
};

export const PrivateConfig = React.memo(({route, navigation}: Props) => {
  const {goTo} = route.params;

  const headerTitle = useMemo(() => {
    switch (goTo) {
      case 'zone':
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

  if (goTo === 'zone') {
    return <Zone />;
  }

  if (goTo === 'time') {
    return <Time />;
  }

  return null;
});
