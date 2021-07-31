import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {UIActivityIndicator} from 'react-native-indicators';

import {UserTabView, stickyTabHeight} from './TabView';
import {Avatar} from './Avatar';
import {EditButton} from './EditButton';
import {TakeFlashButton} from './TakeFlashButton';
import {SendMessageButton} from './SendMessageButton';
import {MoreReadBottun} from './MoreReadButton';
import {IntroduceModal} from './IntoduceModal';
import {BackGroundItem} from './BackGroundItem';
import {SnsIcons} from './SnsIcons';
import {
  MyPageStackParamList,
  UserPageScreenGroupParamList,
} from '../../../navigations/UserPage';
import {UserPageNavigationProp} from '../../../navigations/types';
import {RootState} from '../../../stores/index';
import {selectAllPosts} from '../../../stores/posts';
import {selectAllFlashes} from '../../../stores/flashes';
import {RootNavigationProp} from '~/navigations/Root';
import {judgeMoreDeviceX} from '~/helpers/device';
import {Menu} from '~/components/utils/Menu';
import {normalStyles} from '~/constants/styles';
import {useUser, useRefreshUser} from '~/hooks/users';

// BottomTabに渡される時のプロップス
type MyPageStackScreenProp = RouteProp<MyPageStackParamList, 'MyPage'>;
// StackNavigationに渡される時のプロップス
type ProfileStackScreenProp = RouteProp<
  UserPageScreenGroupParamList,
  'UserPage'
>;

type Props = {
  route: MyPageStackScreenProp | ProfileStackScreenProp;
  navigation: RootNavigationProp<'Tab'> & UserPageNavigationProp<'UserPage'>;
};

export const UserPage = ({route, navigation}: Props) => {
  // TabではなくてStackから呼び出される場合は値が存在する
  const routeParams = useMemo(() => route && route.params, [route]);

  const {isMe, user, anotherUser, me} = useUser({
    from: routeParams?.from,
    userId: routeParams?.userId,
  });

  const myPosts = useSelector((state: RootState) => {
    if (isMe) {
      return selectAllPosts(state);
    }
  });

  const posts = useMemo(() => {
    if (myPosts) {
      return myPosts!;
    } else if (anotherUser) {
      return anotherUser.posts;
    } else {
      return [];
    }
  }, [anotherUser, myPosts]);

  const myFlashes = useSelector((state: RootState) => {
    if (isMe) {
      return selectAllFlashes(state);
    }
  }, shallowEqual);

  const snsLinkData = useMemo(() => {
    if (user) {
      const {instagram, twitter, youtube, tiktok} = user;
      return {instagram, twitter, youtube, tiktok};
    } else {
      return {
        instagram: null,
        twitter: null,
        youtube: null,
        tiktok: null,
      };
    }
  }, [user]);

  const avatarOuterType: 'gradation' | 'silver' | 'none' = useMemo(() => {
    if (me) {
      if (myFlashes && myFlashes.length) {
        return 'gradation';
      } else {
        return 'none';
      }
    } else {
      if (anotherUser?.flashes.entities.length) {
        if (!anotherUser.flashes.isAllAlreadyViewed) {
          return 'gradation';
        } else {
          return 'silver';
        }
      } else {
        return 'none';
      }
    }
  }, [anotherUser?.flashes, myFlashes, me]);

  const [containerHeight, setContainerHeight] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const y = scrollY.interpolate({
    inputRange: [0, profileContainerHeight],
    outputRange: [0, -profileContainerHeight],
    extrapolateRight: 'clamp',
  });

  // 2つの子コンポーネントで必要なrefなのでこのコンポーネントから渡す
  const postsTabViewRef = useRef<FlatList>(null);
  const userInformationTabViewRef = useRef<ScrollView>(null);

  const lineNumber = useMemo(
    () =>
      user?.introduce?.split(/\n|\r\n|\r/).length
        ? user.introduce?.split(/\n|\r\n|\r/).length
        : 0,
    [user?.introduce],
  );

  useLayoutEffect(() => {
    if (route.name === 'UserPage') {
      navigation.setOptions({
        headerTitle: user?.name ? user?.name : 'ユーザーがいません',
      });
    }
  }, [navigation, user, route.name]);

  const flashesNavigationParam = useMemo(() => {
    if (me && isMe && myFlashes?.length) {
      return {
        isMyData: true as const,
        startingIndex: 0 as const,
        dataArray: [
          {
            flashesData: undefined,
            userData: {userId: me.id, from: undefined},
          },
        ],
      };
    }
    if (anotherUser && !isMe && anotherUser.flashes.entities.length) {
      return {
        isMyData: false as const,
        startingIndex: 0,
        dataArray: [
          {
            flashesData: anotherUser.flashes,
            userData: {userId: anotherUser.id, from: routeParams!.from!},
          },
        ],
      };
    }
  }, [anotherUser, isMe, me, myFlashes, routeParams]);

  const {refreshUser} = useRefreshUser();

  useEffect(() => {
    if (!isMe && anotherUser?.id) {
      refreshUser({userId: anotherUser.id});
    }
  }, [anotherUser?.id, isMe, refreshUser]);

  const [introduceHeight, setIntroduceHeight] = useState(0);
  const [introduceModal, setIntroduceModal] = useState(false);
  const [moreReadButton, setMoreReadButton] = useState(false);
  useEffect(() => {
    if (introduceHeight) {
      if (lineNumber * oneIntroduceTextLineHeght > introduceHeight) {
        setMoreReadButton(true);
      } else {
        setMoreReadButton(false);
      }
    }
  }, [introduceHeight, lineNumber]);

  const [videoPaused, setVideoPaused] = useState(false);
  const onBackGroundItemPress = useCallback(() => {
    if (user?.backGroundItem && user?.backGroundItemType) {
      if (user.backGroundItemType === 'video') {
        setVideoPaused(true);
      }
      navigation.navigate('UserBackGroundView', {
        source: user.backGroundItem,
        sourceType: user.backGroundItemType,
      });
    }
  }, [navigation, user?.backGroundItem, user?.backGroundItemType]);

  useEffect(() => {
    // サムネイルのpreload
    if (user?.backGroundItemType === 'video' && user.backGroundItem) {
      FastImage.preload([
        {
          uri: user.backGroundItem,
        },
      ]);
    }
  }, [user?.backGroundItem, user?.backGroundItemType]);

  // BackGroundItemViewから戻ってきた時にビデオが停止されていた場合再開させたい
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (videoPaused) {
        setVideoPaused(false);
      }
    });

    return unsubscribe;
  }, [navigation, videoPaused]);

  const onAvatarPress = useCallback(() => {
    if (flashesNavigationParam) {
      setVideoPaused(true);
      navigation.navigate('Flashes', {
        screen: 'Flashes',
        params: flashesNavigationParam,
      });
    }
  }, [flashesNavigationParam, navigation]);

  const creatingPost = useSelector(
    (state: RootState) => state.otherSettingsReducer.creatingPost,
  );

  const creatingFlash = useSelector(
    (state: RootState) => state.otherSettingsReducer.creatingFlash,
  );

  const displayedMenu = useSelector((state: RootState) => {
    return state.otherSettingsReducer.displayedMenu;
  });

  return (
    <>
      {user ? (
        <View
          style={styles.container}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <Animated.View
            onLayout={(e) => setIntroduceHeight(e.nativeEvent.layout.height)}
            style={[
              styles.introduceContainer,
              {
                transform: [{translateY: y}],
              },
            ]}>
            <Text style={{lineHeight: oneIntroduceTextLineHeght}}>
              {user.introduce}
            </Text>
          </Animated.View>

          {creatingPost && (
            <Animated.View
              style={[
                styles.creatingPostContaienr,
                {transform: [{translateY: y}]},
              ]}>
              <Text style={styles.creatingPostText}>作成中です</Text>
              <View style={{width: 17}}>
                <UIActivityIndicator size={14} color="gray" />
              </View>
            </Animated.View>
          )}

          {creatingFlash && (
            <Animated.View
              style={[
                styles.creatingFlashContaienr,
                {transform: [{translateY: y}]},
              ]}>
              <Text style={styles.creatingPostText}>作成中です</Text>
              <View style={{width: 17}}>
                <UIActivityIndicator size={14} color="gray" />
              </View>
            </Animated.View>
          )}

          <UserTabView
            userId={user.id}
            containerHeight={containerHeight}
            profileContainerHeight={profileContainerHeight}
            posts={posts}
            scrollY={scrollY}
            postsTabViewRef={postsTabViewRef}
            userInformationTabViewRef={userInformationTabViewRef}
          />

          <Animated.View
            style={[
              styles.backGroundImageContainer,
              {transform: [{translateY: y}]},
            ]}>
            <BackGroundItem
              source={user.backGroundItem}
              sourceType={user.backGroundItemType}
              onPress={onBackGroundItemPress}
              videoPaused={videoPaused}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.animatedElement,
              styles.avatarAndNameContainer,
              {
                transform: [{translateY: y}],
              },
            ]}>
            <View style={{alignItems: 'center'}}>
              <Avatar
                source={user.avatar}
                outerType={avatarOuterType}
                onPress={onAvatarPress}
              />

              <View style={styles.nameContainer}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {user.name}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.editProfileOrSendMessageButtonContainer,
              styles.animatedElement,
              {
                transform: [{translateY: y}],
              },
            ]}>
            <View style={{width: '50%'}}>
              {isMe ? (
                <EditButton />
              ) : (
                <SendMessageButton user={anotherUser!} />
              )}
            </View>
          </Animated.View>

          {moreReadButton && (
            <Animated.View
              style={[
                styles.moreReadButtonContainer,
                {transform: [{translateY: y}]},
              ]}>
              <MoreReadBottun onPress={() => setIntroduceModal(true)} />
            </Animated.View>
          )}

          {introduceModal && (
            <IntroduceModal
              show={introduceModal}
              introduce={user.introduce}
              onClose={() => setIntroduceModal(false)}
            />
          )}

          <Animated.View
            style={[
              styles.animatedElement,
              styles.snsIconsContainer,
              {transform: [{translateY: y}]},
            ]}>
            <SnsIcons snsLinkData={snsLinkData} />
          </Animated.View>

          {isMe && (
            <View style={styles.takeWideRangeSourceContainer}>
              <TakeFlashButton />
            </View>
          )}

          {displayedMenu && isMe && <Menu />}
        </View>
      ) : (
        <View>
          <Text>ユーザーがいません</Text>
        </View>
      )}
    </>
  );
};

const {height} = Dimensions.get('screen');

const moreXHeight = judgeMoreDeviceX();

const profileContainerHeight = moreXHeight ? height / 1.9 : height / 1.75;

export const oneIntroduceTextLineHeght = 19.7;

const nameContainerHeight = 19.5;

const avatarAndNameContainerHeight =
  (moreXHeight ? 119.5 : 113) - nameContainerHeight - 10;

const avatarAndNameContainerTop = moreXHeight ? height * 0.115 : height * 0.1;

const introduceContainerTop = moreXHeight ? height * 0.273 : height * 0.284;
const introduceContainerHeight = height * 0.14;

const snsIconsContainerTop = profileContainerHeight - stickyTabHeight - 12;

const backgroundItemHeight = height * 0.16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backGroundImageContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: backgroundItemHeight,
    backgroundColor: normalStyles.imageBackGroundColor,
  },
  introduceContainer: {
    position: 'absolute',
    top: introduceContainerTop,
    paddingHorizontal: 14,
    width: '100%',
    height: introduceContainerHeight,
  },
  avatarAndNameContainer: {
    top: avatarAndNameContainerTop,
    left: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  nameContainer: {
    marginTop: moreXHeight ? 15 : 13,
  },
  editProfileOrSendMessageButtonContainer: {
    width: '100%',
    top: moreXHeight ? height * 0.1 : height * 0.09,
    left: '45%',
    marginTop: avatarAndNameContainerHeight,
  },
  animatedElement: {
    position: 'absolute',
  },
  takeWideRangeSourceContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
  },
  moreReadButtonContainer: {
    position: 'absolute',
    top: introduceContainerTop + introduceContainerHeight,
    right: '2%',
  },
  snsIconsContainer: {
    top: snsIconsContainerTop,
    alignItems: 'center',
  },
  creatingPostContaienr: {
    position: 'absolute',
    top: snsIconsContainerTop + 21,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatingPostText: {
    fontSize: 14,
    color: 'gray',
  },
  creatingFlashContaienr: {
    position: 'absolute',
    top: '22%',
    left: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.25,
  },
});
