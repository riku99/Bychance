import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {TalkRoom} from '../components/screens/TalkRoom';
import {UserPageScreenGroupParamList, useUserPageStackList} from './UserPage';

export type TalkRoomStackParamList = {
  TalkRoom: {
    talkRoomId: number;
    partner: {
      id: string;
    };
  };
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<TalkRoomStackParamList>();

export const TalkRoomStackScreen = React.memo(() => {
  const {renderUserPageStackList} = useUserPageStackList();

  return (
    <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
      <Stack.Screen name="TalkRoom" component={TalkRoom} />
      {renderUserPageStackList()}
    </Stack.Navigator>
  );
});
