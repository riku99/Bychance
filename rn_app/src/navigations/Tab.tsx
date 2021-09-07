import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {CreatePostStackScreen} from './CreatePost';
import {MyPageStackScreen} from './UserPage';
import {NearbyUsersStackScreen} from './NearbyUsers';
import {ChatListStackScreen} from './ChatList';
import {normalStyles} from '~/constants/styles';
import {useTalkRoomMessagesPushNotification} from '~/hooks/pushNotification';
import {RecommendationStackScreen} from './Recommendation';
import {useGetUnreadNumber} from '~/hooks/talkRooms';
import {useSetSafeArea} from '~/hooks/appState';

type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  ChatList: undefined;
  Search: undefined;
  Recommendation: undefined;
};

const RootTab = createBottomTabNavigator<TabList>();

export const Tabs = React.memo(() => {
  const unreadMessageNumber = useGetUnreadNumber();

  // このフックはuseNavigationを使うのでstackに渡されているコンポーネントの中じゃないと使えない
  // stackの中で最初にレンダリングされるのがこのコンポーネントなのでとりあえずここに置く
  useTalkRoomMessagesPushNotification();

  useSetSafeArea();

  return (
    <RootTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{
        // showLabel: false,
        activeTintColor: normalStyles.mainColor,
        inactiveTintColor: '#b8b8b8',
      }}>
      <RootTab.Screen
        name="Search"
        component={NearbyUsersStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="search" size={24} color={color} />
          ),
          tabBarLabel: '見つける',
        }}
      />
      <RootTab.Screen
        name="ChatList"
        component={ChatListStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="chat-bubble-outline" size={24} color={color} />
          ),
          tabBarLabel: 'メッセージ',
          tabBarBadge: unreadMessageNumber ? unreadMessageNumber : undefined,
        }}
      />
      <RootTab.Screen
        name="Recommendation"
        component={RecommendationStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="store" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="CreatePost"
        component={CreatePostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="add-circle-outline" size={24} color={color} />
          ),
          tabBarLabel: '投稿',
        }}
      />
      <RootTab.Screen
        name="Profile"
        component={MyPageStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="person-outline" size={24} color={color} />
          ),
          tabBarLabel: 'マイページ',
        }}
      />
    </RootTab.Navigator>
  );
});
