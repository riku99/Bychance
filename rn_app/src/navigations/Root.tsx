import React from 'react';
import {NavigatorScreenParams} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Tabs} from './Tab';
import {FlashesStackParamList, FlashesStackScreen} from './Flashes';
import {TalkRoomStackParamList, TalkRoomStackScreen} from './TalkRoom';
import {TakeFlashScreen} from '~/components/screens/TakeFlash';
import {getHeaderStatusBarHeight} from '~/helpers/header';
import {UserBackGroundView} from '~/components/screens/UserBackGroundView';
import {UserConfig} from '~/components/screens/UserConfig';
import {PrivateConfig} from '~/components/screens/PrivateConfig';
import {ApplyingGroup} from '~/components/screens/Groups';
import {useUserPageStackList, UserPageScreenGroupParamList} from './UserPage';
import {UserBackGroundItem} from '~/types';
import {UserEditPage} from '~/components/screens/UserEdit';
import {UserEditForm} from '~/components/screens/EditUserItem';

export type RootStackParamList = {
  Tab: undefined;
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
  UserEdit: undefined;
  UserEditForm: {
    type: string;
    value: string | null;
    setValue: (s: string) => void;
  };
} & UserPageScreenGroupParamList;

// Rootスタック領域でのナビゲーションを行いたい場合の型。Tには「Rootスタックレベルの」現在いるスクリーン名を渡す
export type RootNavigationProp<
  T extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

export const RootStackScreen = React.memo(() => {
  const {renderUserPageStackList} = useUserPageStackList();

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerStatusBarHeight: getHeaderStatusBarHeight(),
      }}>
      <Stack.Screen
        name="Tab"
        component={Tabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserBackGroundView"
        component={UserBackGroundView}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
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
      <Stack.Screen
        name="TakeFlash"
        component={TakeFlashScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal-inverted',
        }}
      />
      <Stack.Screen
        name="Flashes"
        component={FlashesStackScreen}
        options={() => {
          return {
            headerShown: false,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: ({current}) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                  transform: [
                    {
                      scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1],
                      }),
                    },
                  ],
                },
              };
            },
          };
        }}
      />
      <Stack.Screen
        name="UserConfig"
        component={UserConfig}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="PrivateConfig"
        component={PrivateConfig}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="Groups"
        component={ApplyingGroup}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen name="UserEdit" component={UserEditPage} />
      <Stack.Screen
        name="UserEditForm"
        component={UserEditForm}
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
    </Stack.Navigator>
  );
});
