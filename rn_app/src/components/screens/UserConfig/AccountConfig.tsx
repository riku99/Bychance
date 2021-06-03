import React, {useMemo} from 'react';
import {View} from 'react-native';

import {commonStyles} from './constants';
import {ConfigList} from './List';

export const AccountConfig = React.memo(() => {
  const list = useMemo(() => {
    return [
      {
        title: 'ログアウト',
        onItemPress: () => console.log('ok'),
      },
    ];
  }, []);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});
