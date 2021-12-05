import React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Button} from 'react-native-elements';
import {Tabs} from './Tab';
import {UserEditStackScreen} from './UserEdit';
import {FlashesStackParamList, FlashesStackScreen} from './Flashes';
import {TalkRoomStackParamList, TalkRoomStackScreen} from './TalkRoom';
import {TakeFlashScreen} from '~/components/screens/TakeFlash';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserBackGroundView} from '~/components/screens/UserBackGroundView';
import {UserConfig} from '~/components/screens/UserConfig';
import {PrivateConfig} from '~/components/screens/PrivateConfig';
import {ApplyingGroup} from '~/components/screens/Groups';
import {defaultTheme} from '~/theme';
import {useUserPageStackList, UserPageScreenGroupParamList} from './UserPage';
import {UserBackGroundItem} from '~/types';

export type RootStackParamList = {
  Tab: undefined;
  UserEditStack: undefined;
  TalkRoomStack: NavigatorScreenParams<TalkRoomStackParamList>;
  TakeFlash: undefined;
  Flashes: NavigatorScreenParams<FlashesStackParamList>;
  UserBackGroundView: Omit<UserBackGroundItem, 'id'>;
  UserConfig: {
    goTo:
      | 'display'
      | 'message'
      | 'location'
      | 'account'
      | 'others'
      | 'group'
      | 'videoCalling';
  };
  PrivateConfig: {
    goTo: 'zone' | 'time';
  };
  Groups: undefined;
} & UserPageScreenGroupParamList;

// Rootスタック領域でのナビゲーションを行いたい場合の型。Tには「Rootスタックレベルの」現在いるスクリーン名を渡す
export type RootNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = React.memo(() => {
  const {renderUserPageStackList} = useUserPageStackList();

  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
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
                      titleStyle={{color: defaultTheme.darkGray}}
                      buttonStyle={{backgroundColor: 'transparent'}}
                      onPress={() => navigation.navigate('UserEdit')}
                    />
                  ),
          };
        }}
      />
      <RootStack.Screen
        name="UserBackGroundView"
        component={UserBackGroundView}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="TalkRoomStack"
        component={TalkRoomStackScreen}
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
        component={TakeFlashScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal-inverted',
        }}
      />
      <RootStack.Screen
        name="Flashes"
        component={FlashesStackScreen}
        options={() => {
          return {
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: 'horizontal',
            // cardStyleInterpolator: ({current}) => {
            //   return {
            //     cardStyle: {
            //       opacity: current.progress.interpolate({
            //         inputRange: [0, 1],
            //         outputRange: [0, 1],
            //       }),
            //       transform: [
            //         {
            //           scale: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [0.6, 1],
            //           }),
            //         },
            //         {
            //           translateY: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [-height, 0],
            //           }),
            //         },
            //         {
            //           translateX: current.progress.interpolate({
            //             inputRange: [0, 1],
            //             outputRange: [-width, 0],
            //           }),
            //         },
            //       ],
            //     },
            //   };
            // },
          };
        }}
      />
      <RootStack.Screen
        name="UserConfig"
        component={UserConfig}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <RootStack.Screen
        name="PrivateConfig"
        component={PrivateConfig}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <RootStack.Screen
        name="Groups"
        component={ApplyingGroup}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      {renderUserPageStackList({
        options: {
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        },
      })}
    </RootStack.Navigator>
  );
});
