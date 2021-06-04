import React, {useMemo} from 'react';
import {View, Alert} from 'react-native';

import {commonStyles} from './constants';
import {ConfigList} from './List';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {logutThunk} from '~/apis/session/logout';

export const AccountConfig = React.memo(() => {
  const dispatch = useCustomDispatch();

  const list = useMemo(() => {
    return [
      {
        title: 'ログアウト',
        onItemPress: () => {
          Alert.alert('ログアウトしますか?', '', [
            {
              text: 'はい',
              onPress: async () => {
                await dispatch(logutThunk());
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
  }, [dispatch]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});
