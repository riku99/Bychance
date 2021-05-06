import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TalkRoomListPage} from '../components/pages/TalkRoomList';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type ChatListStackParamList = {
  ChatList: undefined;
};

const Stack = createStackNavigator<ChatListStackParamList>();

export const ChatListStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="ChatList"
        component={TalkRoomListPage}
        options={{headerTitle: 'メッセージ'}}
      />
    </Stack.Navigator>
  );
};
