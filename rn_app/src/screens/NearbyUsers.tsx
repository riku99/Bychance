import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {NearbyUsers} from '../components/screens/NearbyUsers';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';
import {normalStyles} from '~/constants/styles/normal';
import Emoji from 'react-native-emoji';

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
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="SearchUsers"
        component={NearbyUsers}
        options={{
          headerTitle: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: normalStyles.headerTitleColor,
                }}>
                ユーザーを見つける
              </Text>
              <Emoji name="eyes" />
            </View>
          ),
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
