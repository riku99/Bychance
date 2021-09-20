import React, {useLayoutEffect, useMemo} from 'react';
import {RouteProp, NavigationProp} from '@react-navigation/native';

import {RootStackParamList} from '~/navigations/Root';
import {DisplayConfig} from './DisplayConfig';
import {MessageConfig} from './MessageConfig';
import {AccountConfig} from './AccountConfig';
import {Others} from './Others';
import {LocationConfig} from './LocationConfig';
import {GroupConfig} from './GroupConfig';

type Props = {
  route: RouteProp<RootStackParamList, 'UserConfig'>;
  navigation: NavigationProp<RootStackParamList, 'UserConfig'>;
};

export const UserConfig = React.memo(({route, navigation}: Props) => {
  const {goTo} = route.params;

  const headerTitle = useMemo(() => {
    switch (goTo) {
      case 'display':
        return '表示に関する設定';
      case 'message':
        return 'メッセージに関する設定';
      case 'location':
        return '位置情報に関する設定';
      case 'account':
        return 'アカウントに関する設定';
      case 'group':
        return 'グループに関する設定';
      case 'others':
        return 'その他';
    }
  }, [goTo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [headerTitle, navigation]);

  if (goTo === 'display') {
    return <DisplayConfig />;
  }

  if (goTo === 'message') {
    return <MessageConfig />;
  }

  if (goTo === 'location') {
    return <LocationConfig />;
  }

  if (goTo === 'account') {
    return <AccountConfig />;
  }

  if (goTo === 'others') {
    return <Others />;
  }

  if (goTo === 'group') {
    return <GroupConfig />;
  }

  return null;
});
