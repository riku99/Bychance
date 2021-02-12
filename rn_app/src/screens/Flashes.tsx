import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';
import {FlashesPage} from '../components/pages/Flashes/Page';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';
import {FlashesData} from '../redux/types';

export type FlashesStackParamList = {
  Flashes:
    | {
        isMyData: false;
        startingIndex: number;
        dataArray: {
          flashesData: FlashesData;
          userData: {userId: number; from: 'searchUsers' | 'chatRoom'};
        }[];
      }
    | {
        isMyData: true;
        startingIndex: 0;
        dataArray: {
          flashesData: undefined;
          userData: {userId: number};
        }[];
      };
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<FlashesStackParamList>();

export const FlashesStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
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
};
