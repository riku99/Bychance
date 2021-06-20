import React, {useMemo} from 'react';
import {View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {commonStyles} from './constants';
import {ConfigList} from './List';
import {useCustomDispatch} from '~/hooks/stores';
import {logoutThunk} from '~/thunks/session/logout';

export const AccountConfig = React.memo(() => {
  const dispatch = useCustomDispatch();
  const navigation = useNavigation();

  const list = useMemo(() => {
    return [
      {
        title: 'ログアウト',
        onItemPress: () => {
          Alert.alert('ログアウトしますか?', '', [
            {
              text: 'はい',
              style: 'destructive',
              onPress: async () => {
                await dispatch(logoutThunk());
                navigation.goBack();
                return;
              },
            },
            {
              text: 'いいえ',
              onPress: () => {
                return;
              },
            },
          ]);
        },
      },
    ];
  }, [dispatch, navigation]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});
