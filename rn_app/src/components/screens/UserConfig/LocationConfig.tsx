import React from 'react';
import {View, Switch} from 'react-native';

import {commonStyles} from './constants';

export const LocationConfig = React.memo(() => {
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}></View>
    </View>
  );
});
