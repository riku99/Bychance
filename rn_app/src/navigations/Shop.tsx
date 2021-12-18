import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Shops} from '~/components/screens/Shops';
import {UserPageScreenGroupParamList, useUserPageStackList} from './UserPage';

export type ShopStackParamList = {
  Shops: undefined;
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<ShopStackParamList>();

export const ShopStackScreen = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Shops" component={Shops} />
    </Stack.Navigator>
  );
});
