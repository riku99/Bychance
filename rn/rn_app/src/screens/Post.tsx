import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Container} from '../containers/posts/CreatePost';

export type PostStackParamList = {
  CreatePostTable: undefined;
};

const Stack = createStackNavigator<PostStackParamList>();
const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName="Post">
      <Tab.Screen name="CreatePost" component={Container} />
    </Tab.Navigator>
  );
};

export const PostStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreatePostTable"
        component={Container}
        options={{
          title: '写真の投稿',
        }}
      />
    </Stack.Navigator>
  );
};
