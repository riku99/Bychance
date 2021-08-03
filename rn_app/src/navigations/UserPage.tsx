import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Emoji from 'react-native-emoji';

import {Container as Post} from '../components/screens/Post';
import {Post as PostType} from '../stores/posts';
import {MenuBar} from '../components/utils/MenuBar';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPage} from '../components/screens/UserPage';
import {normalStyles} from '~/constants/styles';
import Logo from '~/assets/logo.svg';

export type MyPageStackParamList = {
  MyPage: undefined;
  Post: PostType;
};

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
    from?: UserPageFrom;
  };
  Post: PostType;
};

// stackで使われるscreenのグループ。Tabに渡されるMyPageStackScreenとは分けて使う
export const userPageScreensGroup = {
  UserPage: UserPage,
  Post: Post,
};
