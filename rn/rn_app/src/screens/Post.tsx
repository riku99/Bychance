import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as CreatePost} from '../containers/posts/CreatePost';

export type PostStackParamList = {
  CreatePostTable: undefined;
};

const Stack = createStackNavigator<PostStackParamList>();

export const PostStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreatePostTable"
        component={CreatePost}
        options={{
          title: '写真の投稿',
        }}
      />
    </Stack.Navigator>
  );
};
