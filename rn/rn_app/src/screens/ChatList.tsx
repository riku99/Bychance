import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {MenuBar} from '../components/utils/MenuBar';
import {Container as ChatList} from '../containers/chats/ChatList';
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
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{headerTitle: 'メッセージ'}}
      />
    </Stack.Navigator>
  );
};
