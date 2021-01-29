import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  TabView,
  TabBar,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';

import {Posts} from '../posts/Posts';
import {basicStyles} from '../../constants/styles';
import {RootState} from '../../redux';
import {Post} from '../../redux/post';
import {Flash} from '../../redux/flashes';
import {UserAvatar} from '../utils/Avatar';
import {UserProfileOuter} from '../utils/UserProfileOuter';
import {useSelector} from 'react-redux';

type PostsRouteProp = {
  posts: Post[];
  navigateToPost: (post: Post) => void;
  containerHeight: number;
  profileContainerHeight: number;
  defaultProfileContainerHeight: number;
  mostRecentlyScrolledView: 'posts' | 'userInformation' | null;
};

// TabSceneに渡され表示されるコンポーネント
const PostsRoute = React.memo(
  ({
    posts,
    navigateToPost,
    profileContainerHeight,
    containerHeight,
    defaultProfileContainerHeight,
    mostRecentlyScrolledView,
  }: PostsRouteProp) => {
    const [contentsHeight, setContentsHeight] = useState(0);
    const paddingTopHeight = useMemo(
      () => profileContainerHeight + stickyTabHeight,
      [profileContainerHeight],
    );

    const scrollableHeight = useMemo(() => {
      // profileの高さが最初と同じ、つまりintoroduceが拡張されていない場合
      if (profileContainerHeight === defaultProfileContainerHeight) {
        switch (mostRecentlyScrolledView) {
          case 'posts':
            return paddingTopHeight;
          case 'userInformation':
            return containerHeight + profileContainerHeight - contentsHeight; // 上部に到達したTabまでスクロールできる高さを持たせる
        }
      }

      // profileの高さが最初より高い、つまりintroduceが拡張されているがpaddingTopの分がContainerを超えていない場合
      if (
        profileContainerHeight > defaultProfileContainerHeight &&
        paddingTopHeight <= containerHeight
      ) {
        switch (mostRecentlyScrolledView) {
          case 'posts':
            return paddingTopHeight;
          case 'userInformation':
            return containerHeight + profileContainerHeight - contentsHeight;
        }
      }

      // paddingTopの値がContainerを超えている場合
      if (paddingTopHeight > containerHeight) {
        switch (mostRecentlyScrolledView) {
          case 'posts':
            return (
              profileContainerHeight +
              stickyTabHeight +
              (paddingTopHeight - containerHeight)
            );
          case 'userInformation':
            return (
              containerHeight +
              profileContainerHeight -
              contentsHeight +
              (paddingTopHeight - containerHeight)
            );
        }
      }
    }, [
      mostRecentlyScrolledView,
      containerHeight,
      profileContainerHeight,
      defaultProfileContainerHeight,
      paddingTopHeight,
      contentsHeight,
    ]);

    return (
      <>
        <View onLayout={(e) => setContentsHeight(e.nativeEvent.layout.height)}>
          <Posts posts={posts} navigateToShowPost={navigateToPost} />
        </View>
        <View
          style={{
            height: scrollableHeight,
          }}
        />
      </>
    );
  },
);

type BasicUserInformationRouteProp = {
  containerHeight: number;
  profileContainerHeight: number;
  mostRecentlyScrolledView: 'posts' | 'userInformation' | null;
  defaultProfileContainerHeight: number;
};

// TabSceneに渡され表示されるコンポーネント
const BasicUserInformationRoute = React.memo(
  ({
    containerHeight,
    profileContainerHeight,
    mostRecentlyScrolledView,
    defaultProfileContainerHeight,
  }: BasicUserInformationRouteProp) => {
    const [contentsHeight, setContentsHeight] = useState(0);

    const paddingTopHeight = useMemo(
      () => profileContainerHeight + stickyTabHeight,
      [profileContainerHeight],
    );

    const scrollableHeight = useMemo(() => {
      // profileの高さが最初と同じ、つまりintoroduceが拡張されていない場合
      if (profileContainerHeight === defaultProfileContainerHeight) {
        switch (mostRecentlyScrolledView) {
          case 'userInformation':
            return paddingTopHeight;
          case 'posts':
            return containerHeight + profileContainerHeight - contentsHeight; // 上部に到達したTabまでスクロールできる高さを持たせる
        }
      }

      // profileの高さが最初より高い、つまりintroduceが拡張されているがpaddingTopの分がContainerを超えていない場合
      if (
        profileContainerHeight > defaultProfileContainerHeight &&
        paddingTopHeight <= containerHeight
      ) {
        switch (mostRecentlyScrolledView) {
          case 'userInformation':
            return paddingTopHeight;
          case 'posts':
            return containerHeight + profileContainerHeight - contentsHeight;
        }
      }

      // paddingTopの値がContainerを超えている場合
      if (paddingTopHeight > containerHeight) {
        switch (mostRecentlyScrolledView) {
          case 'userInformation':
            return (
              profileContainerHeight +
              stickyTabHeight +
              (paddingTopHeight - containerHeight)
            );
          case 'posts':
            return (
              containerHeight +
              profileContainerHeight -
              contentsHeight +
              (paddingTopHeight - containerHeight)
            );
        }
      }
    }, [
      mostRecentlyScrolledView,
      containerHeight,
      profileContainerHeight,
      defaultProfileContainerHeight,
      paddingTopHeight,
      contentsHeight,
    ]);

    return (
      <>
        <View
          style={{
            minHeight:
              containerHeight -
              (defaultProfileContainerHeight + stickyTabHeight),
            justifyContent: 'center',
          }}
          onLayout={(e) => setContentsHeight(e.nativeEvent.layout.height)}>
          <Text style={styles.comingSoon}>coming soon...</Text>
        </View>
        <View
          style={{
            height: scrollableHeight,
          }}
        />
      </>
    );
  },
);

type TabSceneProps = {
  profileContainerHeight: number;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<ScrollView>;
  setMostRecentlyScrolledView: () => void;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  children: Element;
};

// TabViewに渡されるコンポーネント
// TabViewは複数種類のコンポーネントをレンダリングするが、それぞれに共通したロジックを持たせるためのコンポーネント
// ここでの共通したロジックとはアニメーション、スタイル、イベントハンドラなど
const TabScene = ({
  profileContainerHeight,
  scrollY,
  tabViewRef,
  setMostRecentlyScrolledView,
  onScrollEndDrag,
  onMomentumScrollEnd,
  children,
}: TabSceneProps) => {
  return (
    <Animated.ScrollView
      ref={tabViewRef}
      style={{
        paddingTop: profileContainerHeight + stickyTabHeight,
      }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
        listener: () => {
          setMostRecentlyScrolledView();
        },
      })}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}>
      {children}
    </Animated.ScrollView>
  );
};

type Props = {
  user: {
    id: number;
    name: string;
    image: string | null;
    introduce: string | null;
  };
  referenceId: number;
  posts: Post[];
  flashes: {
    entites: Flash[];
    isAllAlreadyViewd?: boolean;
  };
  creatingFlash?: boolean;
  navigateToPost: (post: Post) => void;
  navigateToUserEdit?: () => void;
  navigateToChatRoom?: () => Promise<void> | void;
  navigateToTakeFlash?: () => void;
  navigateToFlashes: () => void;
};

export const UserProfile = React.memo(
  ({
    user,
    posts,
    flashes,
    creatingFlash,
    referenceId,
    navigateToPost,
    navigateToUserEdit,
    navigateToChatRoom,
    navigateToTakeFlash,
    navigateToFlashes,
  }: Props) => {
    const lineNumber = useMemo(
      () =>
        user.introduce?.split(/\n|\r\n|\r/).length
          ? user.introduce?.split(/\n|\r\n|\r/).length
          : 0,
      [user.introduce],
    );
    const displayHideButton = useMemo(
      () =>
        lineNumber * oneTextLineHeght > introduceMaxAndMinHight ? true : false,
      [lineNumber],
    );
    const [hideIntroduce, setHideIntroduce] = useState(
      lineNumber * oneTextLineHeght > introduceMaxAndMinHight ? true : false,
    );

    const creatingPost = useSelector(
      (state: RootState) => state.otherSettingsReducer.creatingPost,
    );

    const [containerHeight, setContainerHeight] = useState(0);
    const [profileContainerHeight, setProfileContainerHeight] = useState(0);
    const defaultProfileContainerHeight = useRef(0);
    const getDefaultContainerHeight = useRef(false);
    useEffect(() => {
      if (!getDefaultContainerHeight.current && profileContainerHeight !== 0) {
        defaultProfileContainerHeight.current = profileContainerHeight;
        getDefaultContainerHeight.current = true;
      }
    }, [profileContainerHeight]);

    const tabRoute: [
      {key: 'posts'; title: 'posts'},
      {key: 'userInformation'; title: 'info'},
    ] = useMemo(
      () => [
        {key: 'posts', title: 'posts'},
        {key: 'userInformation', title: 'info'},
      ],
      [],
    );
    const [tabIndex, setTabndex] = useState(0);
    const [mostRecentlyScrolledView, setMostRecentlyScrolledView] = useState<
      'posts' | 'userInformation' | null
    >(null);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollValue = useRef(0);
    const tabViewOffset = useRef<{[K in 'posts' | 'userInformation']: number}>({
      posts: 0,
      userInformation: 0,
    });
    const postsTabViewRef = useRef<ScrollView>(null);
    const userInformationTabViewRef = useRef<ScrollView>(null);

    // 表示されているTabViewをどれだけスクロールしたかを記録
    useEffect(() => {
      scrollY.addListener(({value}) => {
        const key = tabRoute[tabIndex].key;
        tabViewOffset.current[key] = value;
        scrollValue.current = value;
      });

      return () => {
        scrollY.removeAllListeners();
      };
    }, [scrollY, tabIndex, tabRoute]);

    // 片方のTabViewがスクロールされた場合、もう片方もそのoffsetに合わせる
    const syncScrollOffset = () => {
      const currentRouteTabKey = tabRoute[tabIndex].key;
      if (currentRouteTabKey === 'posts') {
        if (userInformationTabViewRef.current) {
          userInformationTabViewRef.current.scrollTo({
            y: scrollValue.current,
            animated: false,
          });
        }
      } else if (currentRouteTabKey === 'userInformation') {
        if (postsTabViewRef.current) {
          postsTabViewRef.current.scrollTo({
            y: scrollValue.current,
            animated: false,
          });
        }
      }
    };

    // TabViewで使用するTabBarを定義
    const renderTabBar = (
      props: SceneRendererProps & {
        navigationState: NavigationState<{
          key: string;
          title: string;
        }>;
      },
    ) => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [profileContainerHeight, 0],
        extrapolateRight: 'clamp',
      });
      return (
        <Animated.View
          style={[styles.tabBarContainer, {transform: [{translateY: y}]}]}>
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: '#4ba5fa'}}
            style={{backgroundColor: 'white'}}
            renderIcon={({route, focused}) => {
              return route.key === 'posts' ? (
                <MIcon
                  name="apps"
                  size={25}
                  color={focused ? '#4ba5fa' : 'lightgray'}
                />
              ) : (
                <MIcon
                  name="wysiwyg"
                  size={25}
                  color={focused ? '#4ba5fa' : 'lightgray'}
                />
              );
            }}
            renderLabel={() => null}
          />
        </Animated.View>
      );
    };

    // TabViewに渡すコンポーネント
    // TabViewから渡されるrouteに応じて表示する内容を変える
    const renderScene = ({
      route,
    }: SceneRendererProps & {
      route: {
        key: string;
        title: string;
      };
    }) => {
      switch (route.key) {
        case 'posts':
          return (
            <TabScene
              scrollY={scrollY}
              profileContainerHeight={profileContainerHeight}
              tabViewRef={postsTabViewRef}
              setMostRecentlyScrolledView={() => {
                if (
                  tabRoute[tabIndex].key === 'posts' &&
                  mostRecentlyScrolledView !== 'posts'
                ) {
                  setMostRecentlyScrolledView('posts');
                } else if (
                  tabRoute[tabIndex].key === 'userInformation' &&
                  mostRecentlyScrolledView !== 'userInformation'
                ) {
                  setMostRecentlyScrolledView('userInformation');
                }
              }}
              onScrollEndDrag={syncScrollOffset}
              onMomentumScrollEnd={syncScrollOffset}>
              <PostsRoute
                posts={posts}
                navigateToPost={navigateToPost}
                containerHeight={containerHeight}
                profileContainerHeight={profileContainerHeight}
                defaultProfileContainerHeight={
                  defaultProfileContainerHeight.current
                }
                mostRecentlyScrolledView={mostRecentlyScrolledView}
              />
            </TabScene>
          );
        case 'userInformation':
          return (
            <TabScene
              scrollY={scrollY}
              tabViewRef={userInformationTabViewRef}
              profileContainerHeight={profileContainerHeight}
              setMostRecentlyScrolledView={() => {
                if (
                  tabRoute[tabIndex].key === 'posts' &&
                  mostRecentlyScrolledView !== 'posts'
                ) {
                  setMostRecentlyScrolledView('posts');
                } else if (
                  tabRoute[tabIndex].key === 'userInformation' &&
                  mostRecentlyScrolledView !== 'userInformation'
                ) {
                  setMostRecentlyScrolledView('userInformation');
                }
              }}
              onScrollEndDrag={syncScrollOffset}
              onMomentumScrollEnd={syncScrollOffset}
              children={
                <BasicUserInformationRoute
                  containerHeight={containerHeight}
                  profileContainerHeight={profileContainerHeight}
                  defaultProfileContainerHeight={
                    defaultProfileContainerHeight.current
                  }
                  mostRecentlyScrolledView={mostRecentlyScrolledView}
                />
              }
            />
          );
      }
    };

    const renderTabView = () => {
      return (
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{
            index: tabIndex,
            routes: tabRoute,
          }}
          onIndexChange={setTabndex}
          renderScene={renderScene}
          initialLayout={{width: Dimensions.get('window').width}}
        />
      );
    };

    const [
      userImageAndNameContainerHeight,
      setUserImageAndNameContainerHeight,
    ] = useState(0);

    const renderUserProfile = () => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [0, -profileContainerHeight],
        extrapolateRight: 'clamp',
      });
      return (
        <Animated.View
          style={[styles.profileContainer, {transform: [{translateY: y}]}]}
          onLayout={(e) => {
            console.log(e.nativeEvent.layout.height + 'profile');
            setProfileContainerHeight(e.nativeEvent.layout.height);
          }}>
          <View
            onLayout={(e) => {
              setUserImageAndNameContainerHeight(e.nativeEvent.layout.height);
            }}>
            <View style={styles.image} />
            <View
              style={[
                styles.nameContainer,
                {marginTop: flashes.entites.length ? 24 : 20},
              ]}>
              <Text style={styles.name}>{user.name}</Text>
            </View>
          </View>
          <View
            style={[styles.edit, {marginTop: flashes.entites.length ? 24 : 29}]}
          />
          <View
            style={[
              styles.introduce,
              {
                maxHeight: hideIntroduce ? introduceMaxAndMinHight : undefined,
              },
            ]}>
            {!!user.introduce && (
              <Text
                style={{
                  color: basicStyles.mainTextColor,
                  lineHeight: oneTextLineHeght,
                }}>
                {user.introduce}
              </Text>
            )}
          </View>
          <View
            style={{
              height: displayHideButton
                ? expandIntroduceButtonContainer
                : undefined,
            }}
          />
        </Animated.View>
      );
    };

    const renderUserImage = () => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [0, -profileContainerHeight],
        extrapolateRight: 'clamp',
      });
      return (
        <Animated.View
          style={[
            styles.animatedElement,
            {
              justifyContent: 'center',
              height: userImageHeight,
              top: userImageTop,
              transform: [{translateY: y}],
            },
          ]}>
          {(flashes.entites.length && !flashes.isAllAlreadyViewd) ||
          creatingFlash ? (
            <UserProfileOuter avatarSize="large" outerType="gradation">
              <UserAvatar
                image={user.image}
                size="large"
                opacity={1}
                onPress={() => {
                  navigateToFlashes();
                }}
              />
            </UserProfileOuter>
          ) : flashes.entites.length && flashes.isAllAlreadyViewd ? (
            <UserProfileOuter avatarSize="large" outerType="silver">
              <UserAvatar
                image={user.image}
                size="large"
                opacity={1}
                onPress={() => {
                  navigateToFlashes();
                }}
              />
            </UserProfileOuter>
          ) : (
            <UserAvatar image={user.image} size="large" opacity={1} />
          )}
        </Animated.View>
      );
    };

    const renderEditButton = () => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [0, -profileContainerHeight],
        extrapolateRight: 'clamp',
      });

      return (
        <Animated.View
          style={[
            styles.animatedElement,
            {
              top: flashes.entites.length
                ? userImageAndNameContainerHeight + 24
                : userImageAndNameContainerHeight + 29,
              transform: [{translateY: y}],
            },
          ]}>
          {referenceId === user.id ? (
            <Button
              title="プロフィールを編集"
              titleStyle={styles.editButtonTitle}
              buttonStyle={styles.editButton}
              onPress={navigateToUserEdit}
            />
          ) : (
            <Button
              title="メッセージを送る"
              icon={
                <Icon
                  name="send-o"
                  size={15}
                  color="#2c3e50"
                  style={{marginRight: 8}}
                />
              }
              titleStyle={{...styles.editButtonTitle, color: '#2c3e50'}}
              buttonStyle={[styles.editButton, styles.sendMessageButton]}
              onPress={navigateToChatRoom}
            />
          )}
        </Animated.View>
      );
    };

    const renderDisplayIntroduceButton = () => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [0, -profileContainerHeight],
        extrapolateRight: 'clamp',
      });
      return (
        <Animated.View
          style={[
            styles.animatedElement,
            {
              top: profileContainerHeight - expandIntroduceButtonContainer,
              transform: [{translateY: y}],
            },
          ]}>
          {displayHideButton && (
            <Button
              icon={
                <MIcon
                  name={hideIntroduce ? 'expand-more' : 'expand-less'}
                  size={30}
                  style={{color: '#5c94c8'}}
                />
              }
              containerStyle={{
                alignSelf: 'center',
              }}
              buttonStyle={{backgroundColor: 'transparent'}}
              activeOpacity={1}
              onPress={() => {
                // intorduceの範囲を拡張している状態から元に戻した場合、どちらのViewもスクロールして最初の状態に戻す
                if (!hideIntroduce) {
                  postsTabViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                  });
                  userInformationTabViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                  });
                }
                setHideIntroduce(!hideIntroduce);
              }}
            />
          )}
        </Animated.View>
      );
    };

    return (
      <View
        style={styles.container}
        onLayout={(e) => {
          setContainerHeight(e.nativeEvent.layout.height);
        }}>
        {renderUserProfile()}
        {renderTabView()}
        {renderUserImage()}
        {renderEditButton()}
        {renderDisplayIntroduceButton()}

        {referenceId === user.id && (
          <Button
            icon={<MIcon name="flash-on" size={27} style={{color: 'white'}} />}
            containerStyle={styles.storyContainer}
            buttonStyle={styles.stroyButton}
            onPress={navigateToTakeFlash}
          />
        )}
      </View>
    );
  },
);

const {width, height} = Dimensions.get('window');

const oneTextLineHeght = 18.7;

const introduceMaxAndMinHight = height / 7;

const stickyTabHeight = 40.5;

const expandIntroduceButtonContainer = 46;

const userImageHeight = 85;

const userImageTop = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: userImageTop,
    height: userImageHeight,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    marginTop: 3,
    color: basicStyles.mainTextColor,
    fontWeight: '500',
  },
  edit: {
    alignItems: 'center',
    height: 40,
  },
  editButton: {
    backgroundColor: 'white',
    width: '90%',
    height: 32,
    borderRadius: 30,
    alignSelf: 'center',
    borderColor: '#4ba5fa',
    borderWidth: 1,
  },
  editButtonTitle: {
    color: '#4ba5fa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sendMessageButton: {
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 33,
  },
  introduce: {
    minHeight: introduceMaxAndMinHight,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: '5%',
  },
  introduce_text: {
    fontSize: 16,
  },
  storyContainer: {
    position: 'absolute',
    bottom: '3%',
    right: '7%',
  },
  stroyButton: {
    width: width / 7,
    height: width / 7,
    borderRadius: width / 7,
    backgroundColor: '#4ba5fa',
  },
  postProcess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    marginBottom: 5,
  },
  creatingPost: {
    width: 130,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  animatedElement: {
    position: 'absolute',
    alignSelf: 'center',
  },
  comingSoon: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#a6c6f7',
    marginTop: 40,
    marginBottom: 40,
    alignSelf: 'center',
  },
  dummy: {
    height: width / 3,
  },
});
