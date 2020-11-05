import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import {PostStackScreen} from './Post';
import {ProfileStackScreen} from './Profile';
import {SearchStackScreen} from './Search';
import {Container as UserEdit} from '../containers/users/UserEdit';
import {ChatRoom} from '../components/chats/ChatRoom';

export type RootStackParamList = {
  Tab: undefined;
  UserEdit: undefined;
  ChatRoom: undefined;
};

export type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  Chat: undefined;
  Search: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootTab = createBottomTabNavigator<TabList>();

const Tabs = () => {
  return (
    <RootTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{showLabel: false, activeTintColor: '#5c94c8'}}>
      <RootTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="search" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="Chat"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="comment-o" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="CreatePost"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="plus-square-o" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="user-o" size={24} color={color} />
          ),
        }}
      />
    </RootTab.Navigator>
  );
};

export const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{headerBackTitleVisible: false}}>
      <RootStack.Screen
        name="Tab"
        component={Tabs}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="UserEdit"
        component={UserEdit}
        options={{
          title: 'プロフィール編集',
        }}
      />
      <RootStack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: 'メッセージ',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
    </RootStack.Navigator>
  );
};
