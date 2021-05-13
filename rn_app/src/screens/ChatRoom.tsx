import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TalkRoom} from '../components/screens/TalkRoom';
import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';

export type TalkRoomStackParamList = {
  ChatRoom: {roomId: number; partnerId: string};
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<TalkRoomStackParamList>();

export const TalkRoomStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
      <Stack.Screen name="ChatRoom" component={TalkRoom} />
      {Object.entries(userPageScreensGroup).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof UserPageScreenGroupParamList}
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
