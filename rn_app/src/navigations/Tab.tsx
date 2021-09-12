import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Tooltip} from 'react-native-elements/dist/tooltip/Tooltip';

import {CreatePostStackScreen} from './CreatePost';
import {MyPageStackScreen} from './UserPage';
import {NearbyUsersStackScreen} from './NearbyUsers';
import {ChatListStackScreen} from './ChatList';
import {normalStyles} from '~/constants/styles';
import {useTalkRoomMessagesPushNotification} from '~/hooks/pushNotification';
import {RecommendationStackScreen} from './Recommendation';
import {useGetUnreadNumber} from '~/hooks/talkRooms';
import {useSetSafeArea} from '~/hooks/appState';
import {UserAvatar} from '~/components/utils/Avatar';
import {useMyAvatar} from '~/hooks/users';
import {useDisplayedUserTooltip} from '~/hooks/settings';

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

  // SafeAreaInsetesContext下にあるコンポーネントでしかこのフックは使えないが、ReactNavigationによりレンダリングされているのでここだと使用可能
  useSetSafeArea();

  const avatarUrl = useMyAvatar();

  const {currentDisplayedTooltipAboutUserDisplay} = useDisplayedUserTooltip();
  const tooltipRef = useRef<typeof Tooltip | null>(null);
  useEffect(() => {
    if (!currentDisplayedTooltipAboutUserDisplay) {
      // @ts-ignore
      tooltipRef.current?.toggleTooltip();
    }
  }, [currentDisplayedTooltipAboutUserDisplay]);

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
            <View>
              <MIcon name="search" size={24} color={color} />
              <View style={styles.avatarBadgeContainer}>
                <Tooltip
                  // @ts-ignore
                  ref={tooltipRef}
                  popover={<Text>OK</Text>}>
                  <UserAvatar size={22} image={avatarUrl} />
                </Tooltip>
              </View>
            </View>
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
          tabBarLabel: '近くのおすすめ',
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

const styles = StyleSheet.create({
  avatarBadgeContainer: {
    position: 'absolute',
    left: 16,
    top: -5,
  },
});
