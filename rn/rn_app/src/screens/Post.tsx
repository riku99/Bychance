import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Container} from '../containers/posts/Post';

export type PostStackParamList = {
  PostTable: undefined;
};

const Stack = createStackNavigator<PostStackParamList>();
const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName="Post">
      <Tab.Screen name="Post" component={Container} />
    </Tab.Navigator>
  );
};

export const PostStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostTable"
        component={Container}
        options={{
          title: '写真の投稿',
        }}
      />
    </Stack.Navigator>
  );
};
