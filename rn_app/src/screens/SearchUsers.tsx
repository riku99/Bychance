import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SearchUsersPage} from '../components/pages/NearbyUsers/Page';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';
import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';

export type SearchUsersStackParamList = {
  SearchUsers: undefined;
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<SearchUsersStackParamList>();

export const SearchUsersStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {shadowColor: 'transparent'},
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="SearchUsers"
        component={SearchUsersPage}
        options={{title: 'ユーザーを見つける'}}
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
