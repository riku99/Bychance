import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as UserProfile} from '../containers/users/UserProfile';
import {MenuBar} from '../components/utils/MenuBar';
import {Container as Post} from '../containers/posts/Post';

export type UserStackParamList = {
  UserProfile: undefined;
  Post: undefined;
};

const Stack = createStackNavigator<UserStackParamList>();

export const ProfileStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName={'UserProfile'}
      screenOptions={{
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTitle: 'マイページ',
          //animationEnabled: false,
          headerBackTitleVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen component={Post} name="Post" options={{title: '投稿'}} />
    </Stack.Navigator>
  );
};
