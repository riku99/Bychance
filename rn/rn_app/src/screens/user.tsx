import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {UserProfileTable} from '../components/users/UserProfileTable';
import {UserEditTable} from '../components/users/UserEditTable';
import {MenuBar} from '../components/utils/MenuBar';
import {PostStackScreen} from './Post';
import {PostTable} from '../components/posts/PostTable';

export type UserStackParamList = {
  UserProfileTable: undefined;
  UserEditTable: undefined;
  PostTable: {id: number; text: string; image: string};
};

export type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  Chat: undefined;
  Search: undefined;
};

const Stack = createStackNavigator<UserStackParamList>();
const Tab = createBottomTabNavigator<TabList>();

export const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{showLabel: false, activeTintColor: '#5c94c8'}}>
      <Tab.Screen
        name="Search"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="comment-o" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="plus-square-o" size={24} color={color} />
          ),
        }}
      />
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

const getHeaderTitle = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';

  switch (routeName) {
    case 'Profile':
      return 'マイページ';
    case 'CreatePost':
      return '写真の投稿';
    case 'Chat':
      return 'メッセージ';
    case 'Search':
      return 'ユーザーを探す';
  }
};

export const UserStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName={'UserProfileTable'}>
      <Stack.Screen
        name="UserProfileTable"
        component={Tabs}
        options={({route}) => ({
          headerTitle: getHeaderTitle(route),
          animationEnabled: false,
          headerBackTitleVisible: false,
          headerRight: () => <MenuBar />,
          headerLeft: () => null,
        })}
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
      <Stack.Screen
        component={PostTable}
        name="PostTable"
        options={{title: '投稿', headerRight: () => <MenuBar />}}
      />
    </Stack.Navigator>
  );
};
