import React, {useLayoutEffect, useMemo} from 'react';
import {RouteProp, NavigationProp} from '@react-navigation/native';

import {RootStackParamList} from '~/screens/Root';
import {DisplayConfig} from './DisplayConfig';
import {MessageConfig} from './MessageConfig';
import {AccountConfig} from './AccountConfig';

type Props = {
  route: RouteProp<RootStackParamList, 'UserConfing'>;
  navigation: NavigationProp<RootStackParamList, 'UserConfing'>;
};

export const UserConfig = ({route, navigation}: Props) => {
  const {goTo} = route.params;

  const headerTitle = useMemo(() => {
    switch (goTo) {
      case 'display':
        return '表示に関する設定';
      case 'message':
        return 'メッセージに関する設定';
      case 'account':
        return 'アカウントに関する設定';
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

  if (goTo === 'account') {
    return <AccountConfig />;
  }
};
