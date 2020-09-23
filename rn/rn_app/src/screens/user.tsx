import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import {UserProfileTable} from '../components/users/UserProfileTable';
import {UserEditTable} from '../components/users/UserEditTable';
import {MenuBar} from '../components/utils/MenuBar';

export type UserStackParamList = {
  UserProfileTable: undefined;
  UserEditTable: undefined;
};

const Stack = createStackNavigator<UserStackParamList>();
const Tab = createBottomTabNavigator();

export const UserTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{showLabel: false, activeTintColor: '#5c94c8'}}>
      <Tab.Screen
        name="Profile"
        component={UserProfileTable}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="user-o" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const UserStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName={'UserProfileTable'}>
      <Stack.Screen
        name="UserProfileTable"
        component={UserTabs}
        options={{
          title: 'マイページ',
          animationEnabled: false,
          headerBackTitleVisible: false,
          headerRight: () => <MenuBar />,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="UserEditTable"
        component={UserEditTable}
        options={{
          title: 'プロフィール編集',
          animationEnabled: false,
          headerRight: () => <MenuBar />,
        }}
      />
    </Stack.Navigator>
  );
};
