import React from 'react';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as Post} from '../containers/posts/Post';
import {Post as PostType} from '../redux/post';
import {MenuBar} from '../components/utils/MenuBar';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

import {UserPage} from '../components/pages/UserPage/Page';

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
        headerStatusBarHeight: headerStatusBarHeight(),
        headerStyle: {shadowColor: 'transparent'},
      }}>
      <Stack.Screen
        name="MyPage"
        component={UserPage}
        options={{
          headerTitle: () => null,
          headerLeft: () => (
            <Text
              style={{
                marginLeft: 20,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#5c94c8',
              }}>
              マイページ
            </Text>
          ),
          headerRight: () => <MenuBar />,
        }}
      />
      <Stack.Screen component={Post} name="Post" options={{title: '投稿'}} />
    </Stack.Navigator>
  );
};

export type ProfileScreensGroupParamList = {
  UserPage:
    | {
        userId: number;
        from: 'searchUsers';
      }
    | {
        userId: number;
        from: 'chatRoom';
      };
  Post: PostType;
};

// stackで使われるscreenのグループ。Tabに渡されるMyPageStackScreenとは分けて使う
export const profileScreens = {
  UserPage: UserPage,
  Post: Post,
};
