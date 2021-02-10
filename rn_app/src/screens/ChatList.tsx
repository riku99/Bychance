import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ChatListPage} from '../components/pages/CahtList/Page';
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
        component={ChatListPage}
        options={{headerTitle: 'メッセージ'}}
      />
    </Stack.Navigator>
  );
};
