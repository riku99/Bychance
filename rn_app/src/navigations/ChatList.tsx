import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TalkRoomListPage} from '../components/screens/TalkRoomList';
import {getHeaderStatusBarHeight} from '~/helpers/header';

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
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="ChatList"
        component={TalkRoomListPage}
        options={{headerTitle: 'メッセージ'}}
      />
    </Stack.Navigator>
  );
};
