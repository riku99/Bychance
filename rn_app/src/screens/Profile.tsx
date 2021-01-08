import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as UserProfile} from '../containers/users/UserProfile';
import {Container as Post} from '../containers/posts/Post';
import {Post as PostType} from '../redux/post';
import {AnotherUser} from '../components/others/SearchOthers';
import {MenuBar} from '../components/utils/MenuBar';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type MyPageStackParamList = {
  MyProfile: undefined;
  Post: PostType;
};

const Stack = createStackNavigator<MyPageStackParamList>();

// Tabに渡されるstack
export const MyPageStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName={'MyProfile'}
      screenOptions={{
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="MyProfile"
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

export type ProfileScreensGroupParamList = {
  Profile: AnotherUser;
  Post: PostType;
};

// stackで使われるscreenのグループ。Tabに渡されるMyPageStackScreenとは分けて使う
export const profileScreens = {
  Profile: UserProfile,
  Post: Post,
};
