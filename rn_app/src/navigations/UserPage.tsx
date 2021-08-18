import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {Container as Post} from '../components/screens/Post';
import {MenuBar} from '../components/utils/MenuBar';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPage} from '~/components/screens/UserPage';
import Logo from '~/assets/logo.svg';

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

export type UserPageNavigationProp<
  T extends keyof UserPageScreenGroupParamList
> = StackNavigationProp<UserPageScreenGroupParamList, T>;

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
        component={UserPage}
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

export type UserPageFrom = 'nearbyUsers' | 'chatRoom';

export type UserPageScreenGroupParamList = {
  UserPage: {
    userId: string;
  };
  Post: PostScreenType;
};

// stackで使われるscreenのグループ。Tabに渡されるMyPageStackScreenとは分けて使う
export const userPageScreensGroup = {
  UserPage: UserPage,
  Post: Post,
};
