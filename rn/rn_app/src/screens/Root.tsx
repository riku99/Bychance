import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {PostStackScreen} from './Post';
import {ProfileStackScreen} from './Profile';
import {SearchStackScreen} from './Search';
import {ChatListStackScreen} from './ChatList';
import {Container as UserEdit} from '../containers/users/UserEdit';
import {Container as ChatRoom} from '../containers/chats/ChatRoom';
import {Container as TakeFlash} from '../containers/flashs/TakeFlash';
import {Container as ShowFlash} from '../containers/flashs/ShowFlash';
import {Room} from '../redux/rooms';
import {RootState} from '../redux/index';
import {selectAllNotReadMessagesNumber} from '../redux/messages';
import {headerStatusBarHeight} from '../constants/headerStatusBarHeight';

export type RootStackParamList = {
  Tab: undefined;
  UserEdit: undefined;
  ChatRoom: Room;
  TakeFlash: undefined;
  ShowFlash: {userId: number; userName: string; userImage: string | null};
};

export type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  ChatList: undefined;
  Search: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootTab = createBottomTabNavigator<TabList>();

const Tabs = () => {
  const notReadMessageNumber = useSelector((state: RootState) => {
    return selectAllNotReadMessagesNumber(state);
  });

  return (
    <RootTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#5c94c8',
        inactiveTintColor: '#b8b8b8',
      }}>
      <RootTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="search" size={27} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="ChatList"
        component={ChatListStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="chat-bubble-outline" size={24} color={color} />
          ),
          tabBarBadge:
            notReadMessageNumber !== 0 ? notReadMessageNumber : undefined,
        }}
      />
      <RootTab.Screen
        name="CreatePost"
        component={PostStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />
      <RootTab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </RootTab.Navigator>
  );
};

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
        component={UserEdit}
        options={{
          title: 'プロフィール編集',
        }}
      />
      <RootStack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({route}) => {
          return {
            title: route.params.partner.name,
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
        name="ShowFlash"
        component={ShowFlash}
        options={({}) => {
          return {
            headerShown: false,
            gestureDirection: 'vertical',
            gestureResponseDistance: {vertical: 3000},
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
