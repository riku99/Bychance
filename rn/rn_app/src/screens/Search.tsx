import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as SearchOthers} from '../containers/others/SearchOthers';
import {Container as OtherUser} from '../containers/others/AnotherUserProfile';
import {Container as OtherPost} from '../containers/others/OtherPost';
import {MenuBar} from '../components/utils/MenuBar';
import {Post} from '../redux/post';
import {AnotherUser} from '../components/others/SearchOthers';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type SearchStackParamList = {
  SearchOthers: undefined;
  AnotherUserProfile: AnotherUser;
  Post: Post;
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="SearchOthers"
        component={SearchOthers}
        options={{title: 'ユーザーを見つける'}}
      />
      <Stack.Screen
        name="AnotherUserProfile"
        component={OtherUser}
        options={({route}) => {
          return {title: `${route.params.name}のプロフィール`};
        }}
      />
      <Stack.Screen
        name="Post"
        component={OtherPost}
        options={{title: 'ユーザーの投稿'}}
      />
    </Stack.Navigator>
  );
};
