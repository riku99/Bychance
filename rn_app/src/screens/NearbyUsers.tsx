import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {NearbyUsersScreen} from '../components/screens/NearbyUsers';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserPageScreenGroupParamList, userPageScreensGroup} from './UserPage';

export type NearbyUsersStackParamList = {
  NearbyUsers: undefined;
} & UserPageScreenGroupParamList;

export type NearbyUsersStackNavigationProp<
  T extends keyof NearbyUsersStackParamList
> = StackNavigationProp<NearbyUsersStackParamList, T>;

const Stack = createStackNavigator<NearbyUsersStackParamList>();

export const NearbyUsersStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {shadowColor: 'transparent'},
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="NearbyUsers"
        component={NearbyUsersScreen}
        options={{
          headerShown: false,
          // headerTitle: () => (
          //   <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //     <Text
          //       style={{
          //         fontWeight: 'bold',
          //         fontSize: 16,
          //         color: normalStyles.headerTitleColor,
          //       }}>
          //       ユーザーを見つける
          //     </Text>
          //     <Emoji name="eyes" />
          //   </View>
          // ),
        }}
      />
      {Object.entries(userPageScreensGroup).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof UserPageScreenGroupParamList}
          component={component}
          options={({route}) => ({
            headerTitle: route.name === 'Post' ? '投稿' : undefined,
          })}
        />
      ))}
    </Stack.Navigator>
  );
};
