import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {ListView} from './ListView';
import {MapView} from './MapView';

const Tab = createMaterialTopTabNavigator();

export const NearbyUsers = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="リスト" component={ListView} />
      <Tab.Screen name="マップ" component={MapView} />
    </Tab.Navigator>
  );
};
