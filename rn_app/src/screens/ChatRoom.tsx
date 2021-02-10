import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ChatRoomPage} from '../components/pages/ChatRoom/Page';
import {ProfileScreensGroupParamList, profileScreens} from './Profile';

export type ChatRoomStackParamList = {
  ChatRoom: {roomId: number; partnerId: number};
} & ProfileScreensGroupParamList;

const Stack = createStackNavigator<ChatRoomStackParamList>();

export const ChatRoomStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
      <Stack.Screen name="ChatRoom" component={ChatRoomPage} />
      {Object.entries(profileScreens).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof ProfileScreensGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
            headerStyle: {shadowColor: 'transparent'},
          })}
        />
      ))}
    </Stack.Navigator>
  );
};
