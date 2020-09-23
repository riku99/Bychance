import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Post} from '../components/posts/Post';

export type PostStackParamList = {
  PostTable: undefined;
};

const Stack = createStackNavigator<PostStackParamList>();
const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName="Post">
      <Tab.Screen name="Post" component={Post} />
    </Tab.Navigator>
  );
};

export const PostStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostTable"
        component={Post}
        options={{
          title: '写真の投稿',
        }}
      />
    </Stack.Navigator>
  );
};
