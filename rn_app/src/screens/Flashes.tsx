import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  UserPageScreenGroupParamList,
  userPageScreensGroup,
  UserPageFrom,
} from './UserPage';
import {FlashesPage} from '../components/screens/Flashes';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {FlashesData} from '~/stores/types';

export type FlashesStackParamList = {
  Flashes:
    | {
        isMyData: false;
        startingIndex: number;
        dataArray: {
          flashesData: FlashesData;
          userData: {userId: string; from: UserPageFrom};
        }[];
      }
    | {
        isMyData: true;
        startingIndex: 0;
        dataArray: {
          flashesData: undefined;
          userData: {userId: string; from: undefined};
        }[];
      };
} & UserPageScreenGroupParamList;

export type FlashUserData = FlashesStackParamList['Flashes']['dataArray'][number]['userData'];

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
