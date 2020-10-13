import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as SearchOthers} from '../containers/others/SearchUser';

export type SearchStackParamList = {
  SearchOthers: undefined;
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchOthers"
        component={SearchOthers}
        options={{title: 'ユーザーを探す'}}
      />
    </Stack.Navigator>
  );
};
