import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Container as SearchOthers} from '../containers/others/SearchUser';
import {Container} from '../containers/others/OtherUserProfile';
import {MenuBar} from '../components/utils/MenuBar';

export type SearchStackParamList = {
  SearchOthers: undefined;
  OtherProfile: undefined;
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <MenuBar />,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="SearchOthers"
        component={SearchOthers}
        options={{title: 'ユーザーを探す'}}
      />
      <Stack.Screen
        name="OtherProfile"
        component={Container}
        options={{title: 'ユーザーのプロフィール'}}
      />
    </Stack.Navigator>
  );
};
