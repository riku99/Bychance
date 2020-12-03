import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as UserProfile} from '../containers/users/UserProfile';
import {Container as Post} from '../containers/posts/Post';
import {Post as PostType} from '../redux/post';
import {MenuBar} from '../components/utils/MenuBar';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type ProfileStackParamList = {
  UserProfile: undefined;
  Post: PostType;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName={'UserProfile'}
      screenOptions={{
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTitle: 'マイページ',
          animationEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen component={Post} name="Post" options={{title: '投稿'}} />
    </Stack.Navigator>
  );
};
