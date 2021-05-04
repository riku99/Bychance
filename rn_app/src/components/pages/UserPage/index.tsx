import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {
  Profile,
  userAvatarTop,
  userAvatarHeight,
  oneIntroduceTextLineHeght,
  introduceMaxAndMinHight,
} from './Profile';
import {UserTabView} from './TabView';
import {Avatar} from './Avatar';
import {EditButton} from './EditButton';
import {ExpandButton} from './ExpandButton';
import {TakeFlashButton} from './TakeFlashButton';
import {SendMessageButton} from './SendMessageButton';
import {
  MyPageStackParamList,
  UserPageScreenGroupParamList,
} from '../../../screens/UserPage';
import {
  RootNavigationProp,
  UserPageNavigationProp,
} from '../../../screens/types';
import {RootState} from '../../../stores/index';
import {selectAllPosts} from '../../../stores/posts';
import {selectAllFlashes} from '../../../stores/flashes';
import {useMyId, useUser, useAnotherUser} from '../../../hooks/selector/user';
import {refreshUserThunk} from '../../../actions/user/refreshUser';

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

  const referenceId = useMyId();

  // route.paramsが存在しない(Tabから呼び出された)またはuserIdがリファレンスIdと同じ(stackから自分のデータを渡して呼び出した)場合はtrue
  const isMe = useMemo(
    () => !routeParams || routeParams.userId === referenceId,
    [routeParams, referenceId],
  );

  const me = useUser({from: routeParams?.from});

  const anotherUser = useAnotherUser({
    from: routeParams?.from,
    userId: routeParams?.userId,
  });

  // meとanotherUserで共通して使えるものについてはわざわざmeであるかanotherUserであるか検証したくないのでuserとしてまとめる
  // 別々のものとして使いたい時はme, anotherUserのどちらかを使う
  const user = useMemo(() => (me ? me : anotherUser), [me, anotherUser]);

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

  const isNeedOuter = useMemo(() => {
    if (me) {
      return !!myFlashes && !!myFlashes.length;
    } else {
      return !!anotherUser && !!anotherUser.flashes.entities.length;
    }
  }, [me, myFlashes, anotherUser]);

  const [containerHeight, setContainerHeight] = useState(0);
  //const [profileContainerHeight, setProfileContainerHeight] = useState(0);
  // const [
  //   userAvatarAndNameContainerHeight,
  //   setUserAvatarAndNameContainerHeight,
  // ] = useState(0);
  // const [
  //   defaultProfileContainerHeight,
  //   setDefaultProfileContainerHeight,
  // ] = useState(0);
  const getDefaultContainerHeight = useRef(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const y = scrollY.interpolate({
    inputRange: [0, profileContainerHeight],
    outputRange: [0, -profileContainerHeight],
    extrapolateRight: 'clamp',
  });

  // useEffect(() => {
  //   if (!getDefaultContainerHeight.current && profileContainerHeight !== 0) {
  //     setDefaultProfileContainerHeight(profileContainerHeight);
  //     getDefaultContainerHeight.current = true;
  //   }
  // }, [profileContainerHeight]);

  // 2つの子コンポーネントで必要なrefなのでこのコンポーネントから渡す
  const postsTabViewRef = useRef<ScrollView>(null);
  const userInformationTabViewRef = useRef<ScrollView>(null);

  const editContainerTop = useMemo(() => {
    if (isNeedOuter) {
      return 24;
    } else {
      return 29;
    }
  }, [isNeedOuter]);

  const lineNumber = useMemo(
    () =>
      user?.introduce?.split(/\n|\r\n|\r/).length
        ? user.introduce?.split(/\n|\r\n|\r/).length
        : 0,
    [user?.introduce],
  );

  const showExpandButton = useMemo(() => {
    if (lineNumber * oneIntroduceTextLineHeght > introduceMaxAndMinHight) {
      return true;
    } else {
      return false;
    }
  }, [lineNumber]);

  const [expandedIntroduceContainer, setExpandedIntroduceContainer] = useState(
    false,
  );
  const [avatarToIntroduceHeight, setAvatarToIntroduceHeight] = useState(0);

  useLayoutEffect(() => {
    if (route.name === 'UserPage') {
      navigation.setOptions({
        headerTitle: user?.name ? user?.name : 'ユーザーがいません',
      });
    }
  }, [navigation, user, route.name]);

  const flashesNavigationParam = useMemo(() => {
    if (me && isMe && myFlashes) {
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

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMe && anotherUser?.id) {
      dispatch(refreshUserThunk({userId: anotherUser.id}));
    }
  }, [anotherUser?.id, dispatch, isMe]);

  return (
    <>
      {user ? (
        <View
          style={styles.container}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'gray',
              top: 0,
              left: 0,
              width: '100%',
              height: '20%',
              transform: [{translateY: y}],
            }}
          />
          {/* <Animated.View
            style={[styles.profileContaienr, {transform: [{translateY: y}]}]}
            onLayout={(e) =>
              setProfileContainerHeight(e.nativeEvent.layout.height)
            }>
            <Profile
              user={{
                name: user.name,
                introduce: user.introduce,
                avatar: user.avatar,
              }}
              avatarOuterType={avatarOuterType}
              setUserAvatarAndNameContainerHeight={
                setUserAvatarAndNameContainerHeight
              }
              expandedIntroduceContainer={expandedIntroduceContainer}
              setAvatarToIntroduceHeight={setAvatarToIntroduceHeight}
            />
          </Animated.View> */}

          <Animated.View
            style={{
              position: 'absolute',
              top: '35%',
              //backgroundColor: 'red',
              width: '100%',
              paddingHorizontal: 25,
              transform: [{translateY: y}],
              //backgroundColor: 'red',
            }}>
            <Text style={{lineHeight: oneIntroduceTextLineHeght}}>
              {user.introduce}
            </Text>
          </Animated.View>

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
              styles.animatedElement,
              {
                top: '15%', //userAvatarTop,
                //left: 20,
                //height: userAvatarHeight,
                transform: [{translateY: y}],
                //backgroundColor: 'red',
                flexDirection: 'row',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '95%',
              },
            ]}>
            <View style={{alignItems: 'center'}}>
              <Avatar
                source={user.avatar}
                outerType={avatarOuterType}
                flashesNavigationParam={flashesNavigationParam}
              />
              <View style={{marginTop: 15}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {user.name}
                </Text>
              </View>
            </View>
            <View style={{width: '40%'}}>
              {isMe ? (
                <EditButton />
              ) : (
                <SendMessageButton user={anotherUser!} />
              )}
            </View>
          </Animated.View>
          {showExpandButton ? (
            <Animated.View
              style={[
                styles.animatedElement,
                {
                  top: avatarToIntroduceHeight,
                  transform: [{translateY: y}],
                },
              ]}>
              <ExpandButton
                expandedIntroduceContainer={expandedIntroduceContainer}
                setExpandedIntroduceContainer={setExpandedIntroduceContainer}
                postsTabViewRef={postsTabViewRef}
                userInformationTabViewRef={userInformationTabViewRef}
              />
            </Animated.View>
          ) : undefined}
          {isMe && (
            <View style={styles.takeFlashContainer}>
              <TakeFlashButton />
            </View>
          )}
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

const profileContainerHeight = height / 2.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContaienr: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  animatedElement: {
    position: 'absolute',
    alignSelf: 'center',
  },
  takeFlashContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
  },
});
