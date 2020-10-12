import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SearchUser} from '../components/searchs/SearchUser';

export type SearchStackParamList = {
  SearchUser: undefined;
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchUser"
        component={SearchUser}
        options={{title: 'ユーザーを探す'}}
      />
    </Stack.Navigator>
  );
};
