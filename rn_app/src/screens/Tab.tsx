import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {RootState} from '../stores/index';
import {getAllUnreadMessagesNumber} from '../stores/talkRooms';
import {CreatePostStackScreen} from './CreatePost';
import {MyPageStackScreen} from './UserPage';
import {SearchUsersStackScreen} from './SearchUsers';
import {ChatListStackScreen} from './ChatList';
import {normalStyles} from '~/constants/styles/normal';
import {useTalkRoomMessagesPushNotification} from '~/hooks/pushNotification/talkRoomMessages';

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

  // このフックはuseNavigationを使うのでstackに渡されているコンポーネントの中じゃないと使えない
  // stackの中で最初にレンダリングされるのがこのコンポーネントなのでとりあえずここに置く
  useTalkRoomMessagesPushNotification();

  return (
    <RootTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: normalStyles.mainColor,
        inactiveTintColor: '#b8b8b8',
      }}>
      <RootTab.Screen
        name="Search"
        component={SearchUsersStackScreen}
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
        component={CreatePostStackScreen}
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
