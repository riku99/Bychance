import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {NearbyUsersScreen} from '../components/screens/NearbyUsers';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';

export type NearbyUsersStackParamList = {
  NearbyUsers: undefined;
} & UserPageScreenGroupParamList;

export type NearbyUsersStackNavigationProp<
  T extends keyof NearbyUsersStackParamList
> = StackNavigationProp<NearbyUsersStackParamList, T>;

const Stack = createStackNavigator<NearbyUsersStackParamList>();

export const NearbyUsersStackScreen = () => {
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
      {Object.entries(userPageScreensGroup).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof UserPageScreenGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
          })}
        />
      ))}
    </Stack.Navigator>
  );
};
