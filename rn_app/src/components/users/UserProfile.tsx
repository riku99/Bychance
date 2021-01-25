import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  Animated,
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
import {HEIGHT} from '../../constants/bottomTabBar';
import {ScrollView} from 'react-native-gesture-handler';
import {RootState} from '../../redux';
import {Post} from '../../redux/post';
import {Flash} from '../../redux/flashes';
import {UserAvatar} from '../utils/Avatar';
import {UserProfileOuter} from '../utils/UserProfileOuter';
import {useSelector} from 'react-redux';

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

type PostsRouteProp = {
  posts: Post[];
  navigateToPost: (post: Post) => void;
  profileContainerHeight: number;
};

// 実際にTabViewないで表示されるコンポーネントたち
const PostsRoute = React.memo(
  ({posts, navigateToPost, profileContainerHeight}: PostsRouteProp) => {
    return (
      <>
        <View>
          <Posts posts={posts} navigateToShowPost={navigateToPost} />
        </View>
        <View style={{height: profileContainerHeight + stickyHeaderHeight}} />
      </>
    );
  },
);

type BasicUserInformationRouteProp = {
  containerHeght: number;
  profileContainerHeight: number;
  mostRecentlyScrolledView: 'posts' | 'userInformation' | null;
};

const BasicUserInformationRoute = React.memo(
  ({
    containerHeght,
    profileContainerHeight,
    mostRecentlyScrolledView,
  }: BasicUserInformationRouteProp) => {
    return (
      <View
        style={{
          height:
            mostRecentlyScrolledView && mostRecentlyScrolledView === 'posts'
              ? containerHeght +
                profileContainerHeight +
                HEIGHT -
                stickyHeaderHeight
              : undefined,
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#a6c6f7',
            marginTop: 20,
            alignSelf: 'center',
          }}>
          coming soon...
        </Text>
      </View>
    );
  },
);
//

type TabSceneProps = {
  profileContainerHeight: number;
  scrollY: Animated.Value;
  tabViewRef: React.RefObject<ScrollView>;
  setMostRecentlyScrolledView: () => void;
  onScrollEndDrag: () => void;
  onMomentumScrollEnd: () => void;
  children: JSX.Element;
};

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
        paddingTop: profileContainerHeight + stickyHeaderHeight,
      }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
        listener: () => setMostRecentlyScrolledView(),
      })}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}>
      {children}
    </Animated.ScrollView>
  );
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

    // 表示されているTabViewのrouteをどれだけスクロールしたかを記録
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
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            transform: [{translateY: y}],
            zIndex: 1,
          }}>
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
              profileContainerHeight={profileContainerHeight}
              scrollY={scrollY}
              tabViewRef={postsTabViewRef}
              setMostRecentlyScrolledView={() => {
                if (tabRoute[tabIndex].key === 'posts') {
                  setMostRecentlyScrolledView('posts');
                } else {
                  setMostRecentlyScrolledView('userInformation');
                }
              }}
              onScrollEndDrag={syncScrollOffset}
              onMomentumScrollEnd={syncScrollOffset}
              children={
                <PostsRoute
                  posts={posts}
                  profileContainerHeight={profileContainerHeight}
                  navigateToPost={navigateToPost}
                />
              }
            />
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
                  containerHeght={containerHeight}
                  profileContainerHeight={profileContainerHeight}
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

    const renderUserProfile = () => {
      const y = scrollY.interpolate({
        inputRange: [0, profileContainerHeight],
        outputRange: [0, -profileContainerHeight],
        extrapolateRight: 'clamp',
      });
      return (
        <Animated.View
          style={{
            transform: [{translateY: y}],
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
          onLayout={(e) => {
            setProfileContainerHeight(e.nativeEvent.layout.height);
          }}>
          <View style={styles.image}>
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
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <View style={styles.edit}>
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
          </View>
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
              onPress={() => setHideIntroduce(!hideIntroduce)}
            />
          )}
        </Animated.View>
      );
    };

    return (
      <View
        style={styles.container}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
        {renderUserProfile()}
        {renderTabView()}

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

const introduceMaxAndMinHight = height / 5;

const stickyHeaderHeight = 40.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
  },
  profileContainer: {
    width: '100%',
    position: 'absolute',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  name: {
    fontSize: 16,
    marginTop: 3,
    color: basicStyles.mainTextColor,
    fontWeight: '500',
  },
  edit: {
    alignItems: 'center',
    marginTop: 25,
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
  stickyHeader: {
    height: stickyHeaderHeight,
    width: '100%',
    backgroundColor: 'gray',
    borderBottomWidth: 0.5,
    borderBottomColor: basicStyles.imageBackGroundColor,
  },
  creatingPost: {
    width: 130,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
  },
  stickyItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  dummy: {
    height: width / 3,
  },
});
