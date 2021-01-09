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
import {FlashesStackScreen, FlashStackParamList} from './Flash';
import {ChatRoomStackParamParamList, ChatRoomStackScreen} from './ChatRoom';
import {Container as TakeFlash} from '../containers/flashs/TakeFlash';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type RootStackParamList = {
  Tab: undefined;
  UserEdit: undefined;
  ChatRoomStack: NavigatorScreenParams<ChatRoomStackParamParamList>;
  TakeFlash: undefined;
  Flashes: NavigatorScreenParams<FlashStackParamList>;
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
        name="UserEdit"
        component={UserEditStackScreen}
        options={({route, navigation}) => {
          return {
            headerLeft:
              getFocusedRouteNameFromRoute(route) === undefined ||
              getFocusedRouteNameFromRoute(route) === 'EditContents'
                ? undefined
                : () => (
                    <Button
                      title="キャンセル"
                      style={{marginBottom: 3}}
                      titleStyle={{color: '#5c94c8'}}
                      buttonStyle={{backgroundColor: 'transparent'}}
                      onPress={() => navigation.navigate('EditContents')}
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
        component={TakeFlash}
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
