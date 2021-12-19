import React, {useLayoutEffect} from 'react';
import {View} from 'react-native';
import {RootNavigationProp} from '~/navigations/Root';
import {useNavigation} from '@react-navigation/native';

export const Shops = React.memo(() => {
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return <View></View>;
});
