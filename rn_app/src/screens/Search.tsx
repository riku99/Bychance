import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as SearchOthers} from '../containers/users/SearchUsers';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';
import {ProfileScreensGroupParamList, profileScreens} from './Profile';

export type SearchStackParamList = {
  SearchOthers: undefined;
} & ProfileScreensGroupParamList;

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {shadowColor: 'transparent'},
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="SearchOthers"
        component={SearchOthers}
        options={{title: 'ユーザーを見つける'}}
      />
      {Object.entries(profileScreens).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof ProfileScreensGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
          })}
        />
      ))}
    </Stack.Navigator>
  );
};
