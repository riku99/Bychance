import React from 'react';
import {View} from 'react-native';

import {commonStyles} from './constants';
import {ConfigList} from './List';

export const Others = React.memo(() => {
  const list = [
    {
      title: '利用規約',
      onItemPress: () => {},
    },
  ];

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});
