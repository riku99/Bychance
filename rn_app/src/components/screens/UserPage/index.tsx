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

import {UserTabView} from './TabView';
import {Avatar} from './Avatar';
import {EditButton} from './EditButton';
import {TakeFlashButton} from './TakeFlashButton';
import {SendMessageButton} from './SendMessageButton';
import {MoreReadBottun} from './MoreReadButton';
import {IntroduceModal} from './IntoduceModal';
import {BackGroundItem} from './BackGroundItem';
import {
  MyPageStackParamList,
  UserPageScreenGroupParamList,
} from '../../../screens/UserPage';
import {UserPageNavigationProp} from '../../../screens/types';
import {RootState} from '../../../stores/index';
import {selectAllPosts} from '../../../stores/posts';
import {selectAllFlashes} from '../../../stores/flashes';
import {useMyId, useUser, useAnotherUser} from '../../../hooks/selector/user';
import {refreshUserThunk} from '../../../apis/users/refreshUser';
import {X_HEIGHT} from '~/constants/device';
import {RootNavigationProp} from '~/screens/Root';

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
  const postsTabViewRef = useRef<ScrollView>(null);
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

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMe && anotherUser?.id) {
      dispatch(refreshUserThunk({userId: anotherUser.id}));
    }
  }, [anotherUser?.id, dispatch, isMe]);

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

  return (
    <>
      {user ? (
        <View
          style={styles.container}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <Animated.View
            style={[
              styles.backGroundImageContainer,
              {transform: [{translateY: y}]},
            ]}>
            <BackGroundItem
              soruce={user.backGroundItem}
              sorceType={user.backGroundItemType}
            />
          </Animated.View>

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

          <UserTabView
            userId={user.id}
            containerHeight={containerHeight}
            profileContainerHeight={profileContainerHeight}
            posts={posts}
            scrollY={scrollY}
            postsTabViewRef={postsTabViewRef}
            userInformationTabViewRef={userInformationTabViewRef}
            snsLinkData={snsLinkData}
          />

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
                flashesNavigationParam={flashesNavigationParam}
              />

              <View style={styles.nameContainer}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {user.name}
                </Text>
              </View>
            </View>
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

const profileContainerHeight = height / 2;

export const oneIntroduceTextLineHeght = 19.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backGroundImageContainer: {
    position: 'absolute',
    backgroundColor: 'gray',
    top: 0,
    left: 0,
    width: '100%',
    height: '20%',
  },
  introduceContainer: {
    position: 'absolute',
    top: height > X_HEIGHT ? '35%' : '40%',
    width: '100%',
    paddingHorizontal: 25,
    height: '20%',
  },
  avatarAndNameContainer: {
    top: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '95%',
  },
  nameContainer: {
    marginTop: height > X_HEIGHT ? '25%' : '20%',
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
  moreReadButtonContainer: {
    position: 'absolute',
    top: height > X_HEIGHT ? height / 2.3 : height / 2.2,
    right: '2%',
  },
});
