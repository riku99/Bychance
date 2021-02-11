import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

//import {Flashes} from '../components/flashes/Flashes';
import {Flashes} from '../components/pages/Flashes/Page';
import {Container as UserProfile} from '../containers/users/UserProfile';
import {Container as Post} from '../components/pages/Post/Page';
import {
  FlashesWithUser,
  FlashesDataAndUser,
} from '../components/pages/Flashes/ShowFlash';
import {PartiallyPartial} from '../constants/types';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';
import {Post as PostType} from '../redux/post';
import {AnotherUser} from '../redux/types';

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
        component={UserProfile}
        options={({}) => ({
          headerStyle: {shadowColor: 'transparent'},
        })}
      />
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
};

export type FlashStackParamList2 = {
  Flashes: {
    FlashesDataAndUserArray: PartiallyPartial<
      FlashesDataAndUser,
      'flashesData'
    >[];
    startingIndex: number;
  };
  UserProfileFromFlash: AnotherUser;
  Post: PostType;
};

const Stack2 = createStackNavigator<FlashStackParamList2>();

export const FlashesStackScreen2 = () => {
  return (
    <Stack2.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack2.Screen
        name="Flashes"
        component={Flashes}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack2.Screen
        name="UserProfileFromFlash"
        component={UserProfile}
        options={({}) => ({
          headerStyle: {shadowColor: 'transparent'},
        })}
      />
      <Stack.Screen name="Post" component={Post} />
    </Stack2.Navigator>
  );
};
