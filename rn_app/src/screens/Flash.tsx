import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Flashes} from '../components/flashes/Flashes';
import {Container as AnotherUserProfile} from '../containers/users/UserProfile';
import {Container as Post} from '../containers/posts/Post';
import {AnotherUser} from '../components/users/SearchUsers';
import {FlashesWithUser} from '../components/flashes/ShowFlash';
import {PartiallyPartial} from '../constants/d';
import {Post as PostType} from '../redux/post';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type FlashStackParamList = {
  showFlashes: {
    allFlashesWithUser: PartiallyPartial<FlashesWithUser, 'flashes'>[];
    index: number;
  };
  AnotherUserProfileFromFlash: AnotherUser;
  Post: PostType;
};

const Stack = createStackNavigator<FlashStackParamList>();

export const FlashesStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="showFlashes"
        component={Flashes}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="AnotherUserProfileFromFlash"
        component={AnotherUserProfile}
        options={({}) => ({
          headerStyle: {shadowColor: 'transparent'},
        })}
      />
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
};
