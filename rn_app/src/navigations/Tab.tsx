import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Text, Dimensions, Pressable} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Tooltip} from 'react-native-elements/dist/tooltip/Tooltip';
import {useFocusEffect} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {MyPageStackScreen} from './MyPage';
import {NearbyUsersStackScreen} from './NearbyUsers';
import {ChatListStackScreen} from './ChatList';
import {defaultTheme} from '~/theme';
import {usePushNotificationHandler} from '~/hooks/pushNotification';
import {useGetUnreadNumber} from '~/hooks/talkRooms';
import {useSetSafeArea} from '~/hooks/appState';
import {UserAvatar} from '~/components/utils/Avatar';
import {useMyAvatar, useIsDisplayedToOtherUsers} from '~/hooks/users';
import {useTooltipAboutDisplayExperience} from '~/hooks/experiences';
import {TakeFlashScreen} from '~/components/screens/TakeFlash';

type TabList = {
  Profile: undefined;
  CreatePost: undefined;
  ChatList: undefined;
  Search: undefined;
  Flash: undefined;
};

const RootTab = createBottomTabNavigator<TabList>();

export const Tabs = React.memo(() => {
  const unreadMessageNumber = useGetUnreadNumber();

  // このフックはuseNavigationを使うのでstackに渡されているコンポーネントの中じゃないと使えない
  // stackの中で最初にレンダリングされるのがこのコンポーネントなのでとりあえずここに置く
  usePushNotificationHandler();

  // SafeAreaInsetesContext下にあるコンポーネントでしかこのフックは使えないが、ReactNavigationによりレンダリングされているのでここだと使用可能
  useSetSafeArea();

  const avatarUrl = useMyAvatar();

  const {isDisplayedToOtherUsers} = useIsDisplayedToOtherUsers();
  const {
    alreadyShowedTooltip,
    changeTooltipData,
  } = useTooltipAboutDisplayExperience();
  const tooltipRef = useRef<typeof Tooltip | null>(null);
  useFocusEffect(
    useCallback(() => {
      // tooltipの表示若干遅らせないと、ボタンとかでgoBackしたときズレる
      setTimeout(() => {
        if (!alreadyShowedTooltip && isDisplayedToOtherUsers) {
          // @ts-ignore
          tooltipRef.current?.toggleTooltip();
        }
      }, 400);
    }, [isDisplayedToOtherUsers, alreadyShowedTooltip]),
  );

  const onTooltipCloseButtonPress = () => {
    // @ts-ignore
    tooltipRef.current?.toggleTooltip();
    changeTooltipData(true);
  };

  return (
    <RootTab.Navigator
      initialRouteName="Search"
      tabBarOptions={{
        activeTintColor: defaultTheme.darkGray,
        inactiveTintColor: '#b8b8b8',
      }}>
      <RootTab.Screen
        name="Search"
        component={NearbyUsersStackScreen}
        options={({navigation}) => ({
          tabBarIcon: ({color}) => (
            <View>
              <MIcon name="home" size={24} color={color} />
              {isDisplayedToOtherUsers && (
                <View style={styles.avatarBadgeContainer}>
                  <Tooltip
                    // @ts-ignore
                    ref={tooltipRef}
                    width={width * 0.9}
                    height={60}
                    backgroundColor="#404040"
                    pointerColor="#404040"
                    onClose={() => {}}
                    backDropPressDisabled={true}
                    toggleOnPress={false}
                    popover={
                      <View>
                        <Pressable
                          style={styles.tooltipCloseButton}
                          onPress={onTooltipCloseButtonPress}>
                          <Icon name="close" size={22} color="#404040" />
                        </Pressable>
                        <Text style={{color: 'white'}}>
                          他のユーザーに自分が表示されている状態の時は、
                          {'\n'}
                          ここに自身のアイコンが表示されます
                        </Text>
                      </View>
                    }>
                    <UserAvatar
                      size={22}
                      image={avatarUrl}
                      onPress={() => {
                        // ユーザーアイコンがタブアイテムの上に被ってしまい、そこをタップするとタブ移動しないので明示的にナビゲート
                        navigation.navigate('Search');
                      }}
                    />
                  </Tooltip>
                </View>
              )}
            </View>
          ),
          tabBarLabel: 'ホーム',
        })}
      />
      <RootTab.Screen
        name="ChatList"
        component={ChatListStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="chat-bubble-outline" size={24} color={color} />
          ),
          tabBarLabel: 'メッセージ',
          tabBarBadge: unreadMessageNumber ? unreadMessageNumber : undefined,
        }}
      />
      <RootTab.Screen
        name="Flash"
        component={TakeFlashScreen}
        options={{
          tabBarLabel: 'Flash⚡️',
          tabBarIcon: ({color}) => (
            <MIcon name="flare" size={24} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('TakeFlash');
          },
        })}
      />
      <RootTab.Screen
        name="Profile"
        component={MyPageStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon name="person-outline" size={24} color={color} />
          ),
          tabBarLabel: 'マイページ',
        }}
      />
    </RootTab.Navigator>
  );
});

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  avatarBadgeContainer: {
    position: 'absolute',
    left: 21,
    top: -5,
  },
  tooltipCloseButton: {
    position: 'absolute',
    bottom: 45,
  },
});
