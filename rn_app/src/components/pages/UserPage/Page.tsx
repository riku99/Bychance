import React, {useMemo, useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Animated, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';

import {shallowEqual, useSelector} from 'react-redux';

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
import {FlashesDataAndUser} from '../../flashes/ShowFlash';
import {
  MyPageStackParamList,
  ProfileScreensGroupParamList,
} from '../../../screens/Profile';
import {RootState} from '../../../redux/index';
import {selectAllPosts} from '../../../redux/post';
import {selectAllFlashes} from '../../../redux/flashes';
import {PartiallyPartial} from '../../../constants/d';

// BottomTabに渡される時のプロップス
type MyPageStackScreenProp = RouteProp<MyPageStackParamList, 'MyProfile'>;
// StackNavigationに渡される時のプロップス
type ProfileStackScreenProp = RouteProp<
  ProfileScreensGroupParamList,
  'Profile'
>;

type Props = {
  route: MyPageStackScreenProp | ProfileStackScreenProp;
};

export const UserPage = ({route}: Props) => {
  // 自分以外のユーザーを表示する場合は値が存在する
  const [anotherUser, setAnotherUser] = useState(route && route.params);

  const me = useSelector((state: RootState) => {
    if (!anotherUser) {
      return state.userReducer.user;
    }
  }, shallowEqual);

  const user = useMemo(() => (me ? me : anotherUser!), [me, anotherUser]);

  const isMe = useMemo(() => !anotherUser && !!me, [anotherUser, me]);

  const myPosts = useSelector((state: RootState) => {
    if (!anotherUser) {
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
    if (!anotherUser) {
      return selectAllFlashes(state);
    }
  }, shallowEqual);

  const flashesDataAndUser = useMemo((): PartiallyPartial<
    FlashesDataAndUser,
    'flashesData'
  > => {
    if (me) {
      return {
        flashesData: undefined,
        user: {
          id: me.id,
          name: me.name,
          introduce: me.introduce,
          image: me.image,
          message: me.message,
          posts: myPosts!,
        },
      };
    } else {
      return {
        flashesData: anotherUser?.flashes!,
        user: {
          id: anotherUser!.id,
          name: anotherUser!.name,
          introduce: anotherUser!.introduce,
          image: anotherUser!.image,
          message: anotherUser!.message,
          posts: anotherUser!.posts,
        },
      };
    }
  }, [anotherUser, me, myPosts]);

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
  const [profileContainerHeight, setProfileContainerHeight] = useState(0);
  const [
    userAvatarAndNameContainerHeight,
    setUserAvatarAndNameContainerHeight,
  ] = useState(0);
  const [
    defaultProfileContainerHeight,
    setDefaultProfileContainerHeight,
  ] = useState(0);
  const getDefaultContainerHeight = useRef(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const y = scrollY.interpolate({
    inputRange: [0, profileContainerHeight],
    outputRange: [0, -profileContainerHeight],
    extrapolateRight: 'clamp',
  });

  useEffect(() => {
    if (!getDefaultContainerHeight.current && profileContainerHeight !== 0) {
      setDefaultProfileContainerHeight(profileContainerHeight);
      getDefaultContainerHeight.current = true;
    }
  }, [profileContainerHeight]);

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
      user.introduce?.split(/\n|\r\n|\r/).length
        ? user.introduce?.split(/\n|\r\n|\r/).length
        : 0,
    [user.introduce],
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

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
      <Animated.View
        style={[styles.profileContaienr, {transform: [{translateY: y}]}]}
        onLayout={(e) =>
          setProfileContainerHeight(e.nativeEvent.layout.height)
        }>
        <Profile
          user={{name: user.name, introduce: user.introduce, image: user.image}}
          avatarOuterType={avatarOuterType}
          setUserAvatarAndNameContainerHeight={
            setUserAvatarAndNameContainerHeight
          }
          expandedIntroduceContainer={expandedIntroduceContainer}
          setAvatarToIntroduceHeight={setAvatarToIntroduceHeight}
        />
      </Animated.View>
      <UserTabView
        userId={user.id}
        containerHeight={containerHeight}
        profileContainerHeight={profileContainerHeight}
        defaultProfileContainerHeight={defaultProfileContainerHeight}
        posts={posts}
        scrollY={scrollY}
        postsTabViewRef={postsTabViewRef}
        userInformationTabViewRef={userInformationTabViewRef}
        setAnotherUser={setAnotherUser}
      />
      <Animated.View
        style={[
          styles.animatedElement,
          {
            top: userAvatarTop,
            height: userAvatarHeight,
            transform: [{translateY: y}],
          },
        ]}>
        <Avatar
          source={user.image}
          flashesDataAndUser={flashesDataAndUser}
          outerType={avatarOuterType}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedElement,
          {
            top: editContainerTop + userAvatarAndNameContainerHeight,
            transform: [{translateY: y}],
          },
        ]}>
        {isMe ? <EditButton /> : <SendMessageButton />}
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
  );
};

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
