import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {UserPageScreenGroupParamList, useUserPageStackList} from './UserPage';
import {FlashesPage} from '../components/screens/Flashes';
import {getHeaderStatusBarHeight} from '~/helpers/header';

type F = {
  startingIndex: number;
  userIds: string[];
};

export type FlashesStackParamList = {
  Flashes: F;
} & UserPageScreenGroupParamList;

const Stack = createStackNavigator<FlashesStackParamList>();

export const FlashesStackScreen = React.memo(() => {
  const {renderUserPageStackList} = useUserPageStackList();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="Flashes"
        component={FlashesPage}
        options={() => ({
          headerShown: false,
        })}
      />
      {renderUserPageStackList()}
    </Stack.Navigator>
  );
});
