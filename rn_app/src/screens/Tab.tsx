import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {RootState} from '../redux/index';
import {getAllUnreadMessagesNumber} from '../redux/rooms';
import {PostStackScreen} from './Post';
import {MyPageStackScreen} from './Profile';
import {SearchStackScreen} from './Search';
import {ChatListStackScreen} from './ChatList';

type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  ChatList: undefined;
  Search: undefined;
};

const RootTab = createBottomTabNavigator<TabList>();

export const Tabs = () => {
  const unreadMessagesNumber = useSelector((state: RootState) => {
    return getAllUnreadMessagesNumber(state);
  });

  return (
    <RootTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#5c94c8',
        inactiveTintColor: '#b8b8b8',
      }}>
      <RootTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="search" size={27} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="ChatList"
        component={ChatListStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="chat-bubble-outline" size={24} color={color} />
          ),
          tabBarBadge:
            unreadMessagesNumber !== 0 ? unreadMessagesNumber : undefined,
        }}
      />
      <RootTab.Screen
        name="CreatePost"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="Profile"
        component={MyPageStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </RootTab.Navigator>
  );
};
