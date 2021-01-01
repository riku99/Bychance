import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Flashes} from '../components/flashes/Flashes';
import {Container as AnotherUserProfile} from '../containers/users/UserProfile';
import {Container as Post} from '../containers/posts/Post';
import {AnotherUser} from '../components/others/SearchOthers';
import {FlashesWithUser} from '../components/flashes/ShowFlash';
import {PartiallyPartial} from '../constants/d';
import {Post as PostType} from '../redux/post';
import {MenuBar} from '../components/utils/MenuBar';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type FlashStackParamList = {
  Flashes: {
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
        headerRight: () => <MenuBar />,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <Stack.Screen
        name="Flashes"
        component={Flashes}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="AnotherUserProfileFromFlash"
        component={AnotherUserProfile}
        options={({route}) => ({
          title: `${route.params.name}`,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {duration: 200},
            },
            close: {
              animation: 'timing',
              config: {duration: 200},
            },
          },
        })}
      />
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
};
