import React, {useMemo} from 'react';
import {View, Switch} from 'react-native';

import {commonStyles} from './constants';
import {ConfigList, List} from './List';

export const LocationConfig = React.memo(() => {
  const list: List = useMemo(() => {
    return [
      {
        title: '位置情報の削除',
      },
      {
        title: '位置情報を更新',
      },
      {
        title: '位置情報について',
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
