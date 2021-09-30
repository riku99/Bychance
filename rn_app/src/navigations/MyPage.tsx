import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {Container as Post} from '../components/screens/Post';
import {MenuBar} from '../components/utils/MenuBar';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import Logo from '~/assets/logo.svg';
import {MyPage} from '~/components/screens/MyPage';

export type PostScreenType = {
  id: number;
  url: string;
  text: string | null;
  userId: string;
  createdAt: string;
  sourceType: 'image' | 'video';
};

export type MyPageStackParamList = {
  MyPage: undefined;
  Post: PostScreenType;
};

export type MyPageNavigationProp<
  T extends keyof MyPageStackParamList
> = StackNavigationProp<MyPageStackParamList, T>;

const Stack = createStackNavigator<MyPageStackParamList>();

// Tabに渡されるstack
export const MyPageStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName={'MyPage'}
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
        headerStyle: {shadowColor: 'transparent'},
      }}>
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerTitle: () => null,
          headerLeft: () => <Logo height="70%" width={140} />,
          headerRight: () => <MenuBar />,
        }}
      />
      <Stack.Screen component={Post} name="Post" options={{title: '投稿'}} />
    </Stack.Navigator>
  );
};
