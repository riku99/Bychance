import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';
import {FlashesPage} from '../components/screens/Flashes';
import {getHeaderStatusBarHeight} from '~/helpers/header';

type F = {
  startingIndex: number;
  userIds: string[];
};

export type FlashesStackParamList = {
  Flashes: F;
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<FlashesStackParamList>();

export const FlashesStackScreen = React.memo(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="Flashes"
        component={FlashesPage}
        options={() => ({
          headerShown: false,
        })}
      />
      {Object.entries(userPageScreensGroup).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof UserPageScreenGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
            headerStyle: {shadowColor: 'transparent'},
          })}
        />
      ))}
    </Stack.Navigator>
  );
});
