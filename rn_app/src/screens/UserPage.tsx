import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Emoji from 'react-native-emoji';

import {Container as Post} from '../components/pages/Post/Page';
import {Post as PostType} from '../stores/posts';
import {MenuBar} from '../components/utils/MenuBar';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPage} from '../components/pages/UserPage';
import {normalStyles} from '~/constants/styles/normal';

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
          headerLeft: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: normalStyles.headerTitleColor,
                }}>
                マイページ
              </Text>
              <Emoji name="open_hands" style={{fontSize: 30}} />
            </View>
          ),
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
