import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {CreatePost} from '../components/screens/CreatePost';

export type CreatePostStackParamList = {
  CreatePostTable: undefined;
};

const Stack = createStackNavigator<CreatePostStackParamList>();

export const CreatePostStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreatePostTable" component={CreatePost} />
    </Stack.Navigator>
  );
};
