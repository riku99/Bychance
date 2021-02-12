import React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Button} from 'react-native-elements';

import {Tabs} from './Tab';
import {UserEditStackScreen} from './UserEdit';
import {FlashesStackParamList, FlashesStackScreen} from './Flashes';
import {ChatRoomStackParamList, ChatRoomStackScreen} from './ChatRoom';
import {TakeFlashPage} from '../components/pages/TakeFlash/Page';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type RootStackParamList = {
  Tab: undefined;
  UserEditStack: undefined;
  ChatRoomStack: NavigatorScreenParams<ChatRoomStackParamList>;
  TakeFlash: undefined;
  Flashes: NavigatorScreenParams<FlashesStackParamList>;
};

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: headerStatusBarHeight(),
      }}>
      <RootStack.Screen
        name="Tab"
        component={Tabs}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="UserEditStack"
        component={UserEditStackScreen}
        options={({route, navigation}) => {
          return {
            headerLeft:
              getFocusedRouteNameFromRoute(route) === undefined ||
              getFocusedRouteNameFromRoute(route) === 'UserEdit'
                ? undefined
                : () => (
                    <Button
                      title="キャンセル"
                      style={{marginBottom: 3}}
                      titleStyle={{color: '#5c94c8'}}
                      buttonStyle={{backgroundColor: 'transparent'}}
                      onPress={() => navigation.navigate('UserEdit')}
                    />
                  ),
          };
        }}
      />
      <RootStack.Screen
        name="ChatRoomStack"
        component={ChatRoomStackScreen}
        options={() => {
          return {
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: 'horizontal',
          };
        }}
      />
      <RootStack.Screen
        name="TakeFlash"
        component={TakeFlashPage}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal-inverted',
        }}
      />
      <RootStack.Screen
        name="Flashes"
        component={FlashesStackScreen}
        options={({}) => {
          return {
            headerShown: false,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: ({current}) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              };
            },
          };
        }}
      />
    </RootStack.Navigator>
  );
};
