import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-elements';

import {CreatePost} from '../components/pages/CreatePost/Page';
import {getHeaderStatusBarHeight} from '~/helpers/header';

export type CreatePostStackParamList = {
  CreatePostTable: undefined;
};

const Stack = createStackNavigator<CreatePostStackParamList>();

export const CreatePostStackScreen = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreatePostTable"
        component={CreatePost}
        options={{
          title: '写真の投稿',
          headerLeft: () => (
            <Button
              title="キャンセル"
              style={{marginBottom: 3}}
              titleStyle={{color: '#5c94c8'}}
              buttonStyle={{backgroundColor: 'transparent'}}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
          headerStatusBarHeight: getHeaderStatusBarHeight(),
        }}
      />
    </Stack.Navigator>
  );
};
