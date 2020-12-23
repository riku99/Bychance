import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Flashes} from '../components/flashes/Flashes';
import {Container as AnotherUserProfile} from '../containers/others/AnotherUserProfile';
import {Container as Post} from '../containers/posts/Post';
import {AnotherUser} from '../components/others/SearchOthers';
import {FlashesWithUser} from '../components/flashes/ShowFlash';
import {PartiallyPartial} from '../constants/d';
import {Post as PostType} from '../redux/post';
import {MenuBar} from '../components/utils/MenuBar';

export type FlashStackParamList = {
  Flashes: {
    allFlashesWithUser: PartiallyPartial<FlashesWithUser, 'flashes'>[];
    index: number;
  };
  AnotherUserProfile: AnotherUser;
  Post: PostType;
};

const Stack = createStackNavigator<FlashStackParamList>();

export const FlashesStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerRight: () => <MenuBar />,
      }}>
      <Stack.Screen
        name="Flashes"
        component={Flashes}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="AnotherUserProfile"
        component={AnotherUserProfile}
        options={({route}) => ({
          title: `${route.params.name}`,
        })}
      />
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
};
