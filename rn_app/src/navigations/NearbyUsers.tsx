import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {NearbyUsersScreen} from '../components/screens/NearbyUsers';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPageScreenGroupParamList, useUserPageStackList} from './UserPage';

export type NearbyUsersStackParamList = {
  NearbyUsers: undefined;
} & UserPageScreenGroupParamList;

export type NearbyUsersStackNavigationProp<
  T extends keyof NearbyUsersStackParamList
> = StackNavigationProp<NearbyUsersStackParamList, T>;

const Stack = createStackNavigator<NearbyUsersStackParamList>();

export const NearbyUsersStackScreen = () => {
  const {renderUserPageStackList} = useUserPageStackList();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {shadowColor: 'transparent'},
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="NearbyUsers"
        component={NearbyUsersScreen}
        options={{
          headerShown: false,
        }}
      />
      {renderUserPageStackList()}
    </Stack.Navigator>
  );
};
